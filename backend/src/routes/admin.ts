import { Router, Response } from 'express';
import { getSupabase } from '../config/supabase.js';
import { AuthRequest, authenticateToken, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();

// Get all pending approvals
adminRouter.get('/approvals', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getSupabase();

    const { data: maintenances, error } = await supabase
      .from('maintenance')
      .select('*')
      .in('status', ['pendente', 'em_andamento'])
      .order('scheduled_date');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(maintenances || []);
  } catch (error) {
    console.error('Get approvals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve maintenance
adminRouter.post('/approve/:id', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .update({
        status: 'em_andamento',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Maintenance approved', maintenance });
  } catch (error) {
    console.error('Approve maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject maintenance
adminRouter.post('/reject/:id', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const supabase = getSupabase();

    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .update({
        status: 'concluida',
        description: `Rejected: ${reason}`,
        completed_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Maintenance rejected', maintenance });
  } catch (error) {
    console.error('Reject maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
adminRouter.get('/users', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getSupabase();

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(users || []);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (admin only)
adminRouter.put('/users/:id/role', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'technician', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const supabase = getSupabase();

    const { data: user, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system statistics (admin only)
adminRouter.get('/stats', authenticateToken, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getSupabase();

    const [equipmentData, maintenanceData, usersData] = await Promise.all([
      supabase.from('equipment').select('*'),
      supabase.from('maintenance').select('*'),
      supabase.from('users').select('id'),
    ]);

    const stats = {
      totalEquipment: equipmentData.data?.length || 0,
      operationalEquipment: equipmentData.data?.filter((e: any) => e.status === 'operacional').length || 0,
      totalMaintenances: maintenanceData.data?.length || 0,
      pendingMaintenances: maintenanceData.data?.filter((m: any) => m.status === 'pendente').length || 0,
      totalUsers: usersData.data?.length || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
