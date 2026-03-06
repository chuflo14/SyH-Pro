-- SyH Pro MVP: Database Schema & RLS Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- 1. TABLES CREATION
-- =========================================

-- Profiles: Links to auth.users, stores consultant info
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('consultant', 'admin')),
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Companies: Client companies managed by consultants
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cuit TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workers: Employees of the client companies
CREATE TABLE IF NOT EXISTS public.workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  dni TEXT NOT NULL,
  legajo TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- DNI and Legajo must be unique per company (or globally unique depending on strictness, but here we scope to company)
  UNIQUE(company_id, dni),
  UNIQUE(company_id, legajo)
);

-- Courses: Training materials loaded by the consultant
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  video_url TEXT, -- Typically a Supabase Storage public/signed URL
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments: Link between workers and courses
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  due_date TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(worker_id, course_id) -- A worker shouldn't be assigned the exact same course twice concurrently
);

-- =========================================
-- 2. ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Profiles: Consultants can read and update their own profile
CREATE POLICY "Consultants can view own profile" 
  ON public.profiles FOR SELECT 
  USING ( auth.uid() = id );

CREATE POLICY "Consultants can update own profile" 
  ON public.profiles FOR UPDATE 
  USING ( auth.uid() = id );

-- Companies: Consultants can manage only their own companies
CREATE POLICY "Consultants can manage their companies" 
  ON public.companies FOR ALL 
  USING ( consultant_id = auth.uid() );

-- Workers: Consultants can manage workers belonging to their companies
CREATE POLICY "Consultants can manage their workers" 
  ON public.workers FOR ALL 
  USING ( 
    company_id IN (
      SELECT id FROM public.companies WHERE consultant_id = auth.uid()
    )
  );

-- Courses: Consultants can manage only their own courses
CREATE POLICY "Consultants can manage their courses" 
  ON public.courses FOR ALL 
  USING ( consultant_id = auth.uid() );

-- Assignments: Consultants can manage assignments for their workers
CREATE POLICY "Consultants can manage their assignments" 
  ON public.assignments FOR ALL 
  USING ( 
    worker_id IN (
      SELECT w.id FROM public.workers w
      JOIN public.companies c ON w.company_id = c.id
      WHERE c.consultant_id = auth.uid()
    )
  );

-- =========================================
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- =========================================

CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_workers_modtime BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_courses_modtime BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_assignments_modtime BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
