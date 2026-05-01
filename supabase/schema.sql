-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- PROFILES
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  wilaya TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- AVOCATS
-- =========================
CREATE TABLE IF NOT EXISTS public.avocats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  specialite TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  barreau TEXT NOT NULL,
  experience_years INTEGER DEFAULT 1,
  tarif_consultation INTEGER DEFAULT 5000,
  bio TEXT,
  photo_url TEXT,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- CONSULTATIONS
-- =========================
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  avocat_id UUID NOT NULL REFERENCES public.avocats(id) ON DELETE CASCADE,
  date_consultation TIMESTAMPTZ NOT NULL,
  statut TEXT DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'confirmee', 'terminee', 'annulee')),
  description TEXT,
  fichier_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- TRIGGER: NEW USER
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_consultations_client_id 
ON public.consultations(client_id);

CREATE INDEX IF NOT EXISTS idx_consultations_avocat_id 
ON public.consultations(avocat_id);

CREATE INDEX IF NOT EXISTS idx_consultations_statut 
ON public.consultations(statut);

CREATE INDEX IF NOT EXISTS idx_avocats_wilaya 
ON public.avocats(wilaya);

CREATE INDEX IF NOT EXISTS idx_avocats_specialite 
ON public.avocats(specialite);

CREATE INDEX IF NOT EXISTS idx_avocats_user_id 
ON public.avocats(user_id);

-- =========================
-- ENABLE RLS
-- =========================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avocats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- =========================
-- PROFILES POLICIES
-- =========================
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- =========================
-- AVOCATS POLICIES
-- =========================
DROP POLICY IF EXISTS "avocats_select_all" ON public.avocats;
CREATE POLICY "avocats_select_all"
ON public.avocats
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "avocats_update_own" ON public.avocats;
CREATE POLICY "avocats_update_own"
ON public.avocats
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "avocats_insert_admin" ON public.avocats;
CREATE POLICY "avocats_insert_admin"
ON public.avocats
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

DROP POLICY IF EXISTS "avocats_update_admin" ON public.avocats;
CREATE POLICY "avocats_update_admin"
ON public.avocats
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

DROP POLICY IF EXISTS "avocats_delete_admin" ON public.avocats;
CREATE POLICY "avocats_delete_admin"
ON public.avocats
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- =========================
-- CONSULTATIONS POLICIES
-- =========================
DROP POLICY IF EXISTS "consultations_select_own" ON public.consultations;
CREATE POLICY "consultations_select_own"
ON public.consultations
FOR SELECT
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "consultations_insert_own" ON public.consultations;
CREATE POLICY "consultations_insert_own"
ON public.consultations
FOR INSERT
WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "consultations_update_own" ON public.consultations;
CREATE POLICY "consultations_update_own"
ON public.consultations
FOR UPDATE
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "consultations_delete_own" ON public.consultations;
CREATE POLICY "consultations_delete_own"
ON public.consultations
FOR DELETE
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "consultations_avocat_select" ON public.consultations;
CREATE POLICY "consultations_avocat_select"
ON public.consultations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.avocats
    WHERE id = avocat_id AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "consultations_avocat_update" ON public.consultations;
CREATE POLICY "consultations_avocat_update"
ON public.consultations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.avocats
    WHERE id = avocat_id AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "consultations_select_admin" ON public.consultations;
CREATE POLICY "consultations_select_admin"
ON public.consultations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

DROP POLICY IF EXISTS "consultations_update_admin" ON public.consultations;
CREATE POLICY "consultations_update_admin"
ON public.consultations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

DROP POLICY IF EXISTS "consultations_delete_admin" ON public.consultations;
CREATE POLICY "consultations_delete_admin"
ON public.consultations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- =========================
-- VIEW
-- =========================
DROP VIEW IF EXISTS public.avocat_consultations_view;

CREATE VIEW public.avocat_consultations_view AS
SELECT
  c.id,
  c.date_consultation,
  c.statut,
  c.description,
  c.fichier_url,
  c.created_at,
  c.avocat_id,
  c.client_id,
  p.full_name AS client_name,
  p.email AS client_email,
  p.phone AS client_phone,
  p.wilaya AS client_wilaya,
  a.user_id AS avocat_user_id,
  a.tarif_consultation,
  a.full_name AS avocat_name,
  a.specialite AS avocat_specialite
FROM public.consultations c
JOIN public.profiles p ON p.id = c.client_id
JOIN public.avocats a ON a.id = c.avocat_id;
-- =========================
-- SEED DATA
-- =========================
INSERT INTO public.avocats
(full_name, specialite, wilaya, barreau, experience_years, tarif_consultation, bio, disponible)
VALUES
('Karim Mouloud', 'Droit de la famille', 'Alger', 'Alger', 12, 5000, 'Divorce et garde.', true),
('Samira Benali', 'Droit commercial', 'Oran', 'Oran', 8, 7000, 'Business law.', true),
('Mohamed Tlemcani', 'Droit pénal', 'Constantine', 'Constantine', 20, 10000, 'Criminal law.', true),
('Nadia Cherif', 'Droit immobilier', 'Alger', 'Alger', 6, 6000, 'Real estate.', false),
('Rachid Boukhalfa', 'Droit du travail', 'Annaba', 'Annaba', 15, 5500, 'Labor law.', true),
('Fatima Hadj-Arab', 'Droit administratif', 'Tizi Ouzou', 'Tizi Ouzou', 10, 4500, 'Admin law.', true);