-- ============================================================
-- AVOCAT-LINK — Schéma SQL Supabase
-- Thème : Juridique
-- A=Clients (auth.users+profiles), B=Avocats, C=Consultations
-- ============================================================

-- ─────────────────────────────────────────
-- TABLE A : profiles (extends auth.users)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  wilaya      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────
-- TABLE B : avocats (resources)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.avocats (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name             TEXT NOT NULL,
  specialite            TEXT NOT NULL,
  wilaya                TEXT NOT NULL,
  barreau               TEXT NOT NULL,
  experience_years      INTEGER DEFAULT 1,
  tarif_consultation    INTEGER DEFAULT 5000,   -- in DZD
  bio                   TEXT,
  photo_url             TEXT,
  disponible            BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- TABLE C : consultations (interactions A↔B)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  avocat_id           UUID NOT NULL REFERENCES public.avocats(id) ON DELETE CASCADE,
  date_consultation   TIMESTAMPTZ NOT NULL,
  statut              TEXT DEFAULT 'en_attente'
                      CHECK (statut IN ('en_attente', 'confirmee', 'terminee', 'annulee')),
  description         TEXT,
  Dossierpreuve_url         TEXT,      -- URL from Supabase Storage
  created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_consultations_client_id  ON public.consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_avocat_id  ON public.consultations(avocat_id);
CREATE INDEX IF NOT EXISTS idx_consultations_statut     ON public.consultations(statut);
CREATE INDEX IF NOT EXISTS idx_avocats_wilaya           ON public.avocats(wilaya);
CREATE INDEX IF NOT EXISTS idx_avocats_specialite       ON public.avocats(specialite);


-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — CRITÈRE ÉLIMINATOIRE
-- ─────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avocats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;


-- PROFILES: users can only read/update their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- AVOCATS: everyone can read (public directory), only service role can write
CREATE POLICY "avocats_select_all" ON public.avocats
  FOR SELECT USING (true);


-- CONSULTATIONS: ⚡ KEY RLS — each client sees ONLY their own consultations
CREATE POLICY "consultations_select_own" ON public.consultations
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "consultations_insert_own" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "consultations_update_own" ON public.consultations
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "consultations_delete_own" ON public.consultations
  FOR DELETE USING (auth.uid() = client_id);


-- ─────────────────────────────────────────
-- SUPABASE STORAGE — Bucket "dossiers"
-- ─────────────────────────────────────────
-- Run this in Supabase Dashboard → Storage → New Bucket
-- Name: dossiers
-- Public: false (private bucket, access via signed URLs)

-- Storage RLS: users can upload to their own folder only
-- Go to: Storage → Policies → New Policy on "dossiers" bucket

-- INSERT policy (upload):
-- USING: (bucket_id = 'dossiers' AND auth.uid()::text = (storage.foldername(name))[1])

-- SELECT policy (download):
-- USING: (bucket_id = 'dossiers' AND auth.uid()::text = (storage.foldername(name))[1])


-- ─────────────────────────────────────────
-- SEED DATA — Sample avocats for testing
-- ─────────────────────────────────────────
INSERT INTO public.avocats (full_name, specialite, wilaya, barreau, experience_years, tarif_consultation, bio, disponible)
VALUES
  ('Karim Mouloud',    'Droit de la famille', 'Alger',       'Alger',       12, 5000,  'Spécialisé en divorce, garde d''enfants et successions. 12 ans d''expérience au barreau d''Alger.', true),
  ('Samira Benali',    'Droit commercial',    'Oran',         'Oran',         8, 7000,  'Experte en création de sociétés, contrats commerciaux et contentieux B2B.', true),
  ('Mohamed Tlemcani', 'Droit pénal',         'Constantine',  'Constantine', 20, 10000, 'Pénaliste avec 20 ans de barreau. Spécialisé en criminalité économique.', true),
  ('Nadia Cherif',     'Droit immobilier',    'Alger',        'Alger',        6, 6000,  'Conseille particuliers et promoteurs sur les transactions immobilières et litiges fonciers.', false),
  ('Rachid Boukhalfa', 'Droit du travail',    'Annaba',       'Annaba',      15, 5500,  'Défend salariés et employeurs dans les conflits individuels et collectifs du travail.', true),
  ('Fatima Hadj-Arab', 'Droit administratif', 'Tizi Ouzou',   'Tizi Ouzou',  10, 4500,  'Spécialisée dans les recours contre les décisions administratives et marchés publics.', true);
