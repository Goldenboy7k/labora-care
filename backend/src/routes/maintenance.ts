import { Router, Response } from 'express';
import { getSupabase } from '../config/supabase.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

export const maintenanceRouter = Router();

// Get all maintenance
maintenanceRouter.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status, lab_id, equipment_id } = req.query;
    const supabase = getSupabase();

    let query = supabase.from('maintenance').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (lab_id) {
      query = query.eq('lab_id', lab_id);
    }

    if (equipment_id) {
      query = query.eq('equipment_id', equipment_id);
    }

    const { data: maintenances, error } = await query.order('scheduled_date');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(maintenances || []);
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get maintenance by id
maintenanceRouter.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !maintenance) {
      return res.status(404).json({ error: 'Maintenance not found' });
    }

    res.json(maintenance);
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create maintenance
maintenanceRouter.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { equipment_id, equipment_name, lab_id, type, scheduled_date, description, responsible } = req.body;

    if (!equipment_id || !type || !scheduled_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();

    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .insert([
        {
          equipment_id,
          equipment_name,
          lab_id,
          type,
          status: 'pendente',
          scheduled_date,
          description,
          responsible: responsible || req.user?.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update maintenance status
maintenanceRouter.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, completed_date, description } = req.body;
    const supabase = getSupabase();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (completed_date) {
      updateData.completed_date = completed_date;
    }

    if (description) {
      updateData.description = description;
    }

    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(maintenance);
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete maintenance
maintenanceRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { error } = await supabase.from('maintenance').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Maintenance deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
