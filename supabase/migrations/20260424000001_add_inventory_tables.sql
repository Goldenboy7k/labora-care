-- Create laboratories table
CREATE TABLE IF NOT EXISTS public.laboratories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  equipment_count integer NOT NULL DEFAULT 0,
  pending_maintenance integer NOT NULL DEFAULT 0,
  overdue_maintenance integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create equipment status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_status') THEN
    CREATE TYPE public.equipment_status AS ENUM ('operacional', 'em_manutencao', 'inativo');
  END IF;
END$$;

-- Create equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text NOT NULL UNIQUE,
  lab_id uuid REFERENCES public.laboratories(id) ON DELETE SET NULL,
  status public.equipment_status NOT NULL DEFAULT 'operacional',
  acquisition_date date,
  last_maintenance timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create maintenance status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'maintenance_status') THEN
    CREATE TYPE public.maintenance_status AS ENUM ('pendente', 'em_andamento', 'concluida', 'atrasada');
  END IF;
END$$;

-- Create maintenance table
CREATE TABLE IF NOT EXISTS public.maintenance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid REFERENCES public.equipment(id) ON DELETE SET NULL,
  equipment_name text NOT NULL,
  lab_id uuid REFERENCES public.laboratories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('preventiva', 'corretiva')),
  status public.maintenance_status NOT NULL DEFAULT 'pendente',
  scheduled_date date NOT NULL,
  completed_date timestamptz,
  description text,
  responsible text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_laboratories_updated_at
BEFORE UPDATE ON public.laboratories
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_maintenance_updated_at
BEFORE UPDATE ON public.maintenance
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
