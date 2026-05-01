-- ============================================================
-- MIGRATION: Inscription Avocat & Espace Admin
-- ============================================================

-- 1. Ajouter la notion d'admin aux profils (par défaut false)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Vous pouvez passer votre propre compte en admin en exécutant plus tard :
-- UPDATE public.profiles SET is_admin = true WHERE email = 'votre@email.com';

-- 2. Ajouter les nouvelles colonnes à la table avocats
ALTER TABLE public.avocats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.avocats ADD COLUMN IF NOT EXISTS statut_verification TEXT DEFAULT 'en_attente' CHECK (statut_verification IN ('en_attente', 'verifie', 'rejete'));

-- Optionnel: Mettre les avocats de démonstration (déjà existants) en 'verifie'
UPDATE public.avocats SET statut_verification = 'verifie' WHERE statut_verification = 'en_attente';

-- 3. Mettre à jour les règles de sécurité (RLS) pour la table avocats
DROP POLICY IF EXISTS "avocats_select_all" ON public.avocats;
DROP POLICY IF EXISTS "avocats_select" ON public.avocats;

-- Règle SELECT : 
-- - Le public voit uniquement les avocats vérifiés
-- - L'avocat voit son propre profil (même en attente)
-- - L'admin voit tout le monde
CREATE POLICY "avocats_select" ON public.avocats FOR SELECT USING (
  statut_verification = 'verifie' 
  OR auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Règle INSERT : Un utilisateur authentifié peut s'inscrire comme avocat
CREATE POLICY "avocats_insert" ON public.avocats FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Règle UPDATE :
-- - L'admin peut tout modifier (ex: changer le statut)
-- - L'avocat peut modifier ses propres infos (sauf son statut, mais géré par le frontend)
CREATE POLICY "avocats_update" ON public.avocats FOR UPDATE USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 4. Permettre aux avocats de voir leurs consultations reçues
DROP POLICY IF EXISTS "consultations_select_own" ON public.consultations;
CREATE POLICY "consultations_select_own" ON public.consultations FOR SELECT USING (
  auth.uid() = client_id 
  OR auth.uid() IN (SELECT user_id FROM public.avocats WHERE id = avocat_id)
);

-- Permettre aux avocats de modifier le statut de la consultation
DROP POLICY IF EXISTS "consultations_update_own" ON public.consultations;
CREATE POLICY "consultations_update_own" ON public.consultations FOR UPDATE USING (
  auth.uid() = client_id 
  OR auth.uid() IN (SELECT user_id FROM public.avocats WHERE id = avocat_id)
);
