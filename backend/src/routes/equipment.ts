import { Router, Response } from 'express';
import { getSupabase } from '../config/supabase.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

export const equipmentRouter = Router();

// Get all equipment
equipmentRouter.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { lab_id, status } = req.query;
    const supabase = getSupabase();

    let query = supabase.from('equipment').select('*');

    if (lab_id) {
      query = query.eq('lab_id', lab_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: equipment, error } = await query.order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(equipment || []);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get equipment by id
equipmentRouter.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create equipment
equipmentRouter.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, brand, model, serial_number, lab_id, status, acquisition_date } = req.body;

    if (!name || !brand || !model || !serial_number || !lab_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();

    const { data: equipment, error } = await supabase
      .from('equipment')
      .insert([
        {
          name,
          brand,
          model,
          serial_number,
          lab_id,
          status: status || 'operacional',
          acquisition_date,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(equipment);
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update equipment
equipmentRouter.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, model, status, serial_number, acquisition_date, last_maintenance } = req.body;
    const supabase = getSupabase();

    const { data: equipment, error } = await supabase
      .from('equipment')
      .update({
        name,
        brand,
        model,
        status,
        serial_number,
        acquisition_date,
        last_maintenance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete equipment
equipmentRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { error } = await supabase.from('equipment').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
