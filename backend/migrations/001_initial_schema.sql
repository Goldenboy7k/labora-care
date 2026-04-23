-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'technician', 'operator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Laboratories table
CREATE TABLE IF NOT EXISTS laboratories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  equipment_count INTEGER DEFAULT 0,
  pending_maintenance INTEGER DEFAULT 0,
  overdue_maintenance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  lab_id INTEGER NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'operacional' CHECK (status IN ('operacional', 'em_manutencao', 'inativo')),
  acquisition_date DATE,
  last_maintenance TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  lab_id INTEGER NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('preventiva', 'corretiva')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'atrasada')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  responsible TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_equipment_lab_id ON equipment(lab_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_equipment_id ON maintenance(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_lab_id ON maintenance(lab_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance(status);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for laboratories (everyone can read)
CREATE POLICY "Everyone can read laboratories" ON laboratories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert laboratories" ON laboratories
  FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can update laboratories" ON laboratories
  FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete laboratories" ON laboratories
  FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for equipment (everyone can read)
CREATE POLICY "Everyone can read equipment" ON equipment
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert equipment" ON equipment
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update equipment" ON equipment
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete equipment" ON equipment
  FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for maintenance (everyone can read)
CREATE POLICY "Everyone can read maintenance" ON maintenance
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert maintenance" ON maintenance
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update maintenance" ON maintenance
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete maintenance" ON maintenance
  FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
