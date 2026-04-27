import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Profile = {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
}

export type Avocat = {
  id: string
  full_name: string
  specialite: string
  wilaya: string
  barreau: string
  experience_years: number
  tarif_consultation: number
  bio: string
  photo_url: string | null
  disponible: boolean
  created_at: string
}

export type Consultation = {
  id: string
  client_id: string
  avocat_id: string
  date_consultation: string
  statut: 'en_attente' | 'confirmee' | 'terminee' | 'annulee'
  description: string
  fichier_url: string | null
  created_at: string
  avocat?: Avocat
}
