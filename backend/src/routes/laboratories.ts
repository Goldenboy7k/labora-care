import { Router, Response } from 'express';
import { getSupabase } from '../config/supabase.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

export const laboratoriesRouter = Router();

// Get all laboratories
laboratoriesRouter.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getSupabase();

    const { data: labs, error } = await supabase
      .from('laboratories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(labs || []);
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get laboratory by id
laboratoriesRouter.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: lab, error } = await supabase
      .from('laboratories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !lab) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }

    res.json(lab);
  } catch (error) {
    console.error('Get laboratory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create laboratory (admin only)
laboratoriesRouter.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create laboratories' });
    }

    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ error: 'Name and icon are required' });
    }

    const supabase = getSupabase();

    const { data: lab, error } = await supabase
      .from('laboratories')
      .insert([
        {
          name,
          icon,
          equipment_count: 0,
          pending_maintenance: 0,
          overdue_maintenance: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(lab);
  } catch (error) {
    console.error('Create laboratory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update laboratory (admin only)
laboratoriesRouter.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update laboratories' });
    }

    const { id } = req.params;
    const { name, icon } = req.body;
    const supabase = getSupabase();

    const { data: lab, error } = await supabase
      .from('laboratories')
      .update({ name, icon, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(lab);
  } catch (error) {
    console.error('Update laboratory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete laboratory (admin only)
laboratoriesRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete laboratories' });
    }

    const { id } = req.params;
    const supabase = getSupabase();

    const { error } = await supabase.from('laboratories').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Laboratory deleted successfully' });
  } catch (error) {
    console.error('Delete laboratory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
