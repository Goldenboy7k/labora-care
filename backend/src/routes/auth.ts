import { Router, Response } from 'express';
import { getSupabase } from '../config/supabase.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

export const authRouter = Router();

// Cadastro
authRouter.post('/signup', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const supabase = getSupabase();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    // Insert user profile
    const { error: dbError } = await supabase.from('users').insert([
      {
        id: authData.user.id,
        email,
        name,
        role: 'operator',
        created_at: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error('Error inserting user profile:', dbError);
    }

    // Get session
    const { data: sessionData } = await supabase.auth.getSession();

    res.status(201).json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        role: 'operator',
      },
      token: sessionData?.session?.access_token || '',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
authRouter.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const supabase = getSupabase();

    // Sign in with Supabase
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(500).json({ error: 'Failed to retrieve user profile' });
    }

    res.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
      },
      token: session.access_token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const supabase = getSupabase();

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
authRouter.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
