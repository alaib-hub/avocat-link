'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DefaultAvatar from '@/components/DefaultAvatar'
import { createClient, type Avocat } from '@/lib/supabase'
import styles from './page.module.css'

const MOCK_AVOCATS: Record<string, Avocat> = {
  '1': { id: '1', full_name: 'Karim Mouloud', specialite: 'Droit de la famille', wilaya: 'Alger', barreau: 'Alger', experience_years: 12, tarif_consultation: 5000, bio: "Avocat spécialisé en droit de la famille avec plus de 12 ans d'expérience. Diplômé de l'université d'Alger.", photo_url: null, disponible: true, created_at: '' },
  '2': { id: '2', full_name: 'Samira Benali', specialite: 'Droit commercial', wilaya: 'Oran', barreau: 'Oran', experience_years: 8, tarif_consultation: 7000, bio: 'Experte en droit des affaires et droit commercial.', photo_url: null, disponible: true, created_at: '' },
  '3': { id: '3', full_name: 'Mohamed Tlemcani', specialite: 'Droit pénal', wilaya: 'Constantine', barreau: 'Constantine', experience_years: 20, tarif_consultation: 10000, bio: 'Pénaliste reconnu avec 20 ans de barreau.', photo_url: null, disponible: true, created_at: '' },
  '4': { id: '4', full_name: 'Nadia Cherif', specialite: 'Droit immobilier', wilaya: 'Alger', barreau: 'Alger', experience_years: 6, tarif_consultation: 6000, bio: 'Avocate spécialisée en droit immobilier et foncier.', photo_url: null, disponible: false, created_at: '' },
  '5': { id: '5', full_name: 'Rachid Boukhalfa', specialite: 'Droit du travail', wilaya: 'Annaba', barreau: 'Annaba', experience_years: 15, tarif_consultation: 5500, bio: 'Avocat en droit social et droit du travail.', photo_url: null, disponible: true, created_at: '' },
  '6': { id: '6', full_name: 'Fatima Hadj-Arab', specialite: 'Droit administratif', wilaya: 'Tizi Ouzou', barreau: 'Tizi Ouzou', experience_years: 10, tarif_consultation: 4500, bio: 'Spécialisée dans les recours contre les décisions administratives.', photo_url: null, disponible: true, created_at: '' },
}

const SPECIALITE_ICONS: Record<string, string> = {
  'Droit de la famille': '👨‍👩‍👧',
  'Droit commercial': '🏢',
  'Droit immobilier': '🏠',
  'Droit pénal': '⚖️',
  'Droit du travail': '👷',
  'Droit des affaires': '💼',
  'Droit administratif': '📋',
  'Droit civil': '📜',
}

export default function AvocatProfilePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [avocat, setAvocat] = useState<Avocat | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchAvocat() {
      const id = params.id as string
      const { data, error } = await supabase
        .from('avocats')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setAvocat(data)
      } else {
        const mock = MOCK_AVOCATS[id]
        if (mock) {
          setAvocat(mock)
        } else {
          setNotFound(true)
        }
      }
      setLoading(false)
    }
    fetchAvocat()
  }, [params.id])

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={`container ${styles.loadingContainer}`}>
          <div className={`skeleton ${styles.profileSkeleton}`} />
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !avocat) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={`container ${styles.notFound}`}>
          <span className={styles.notFoundIcon}>🔍</span>
          <h2>Avocat non trouvé</h2>
          <p>Ce profil n'existe pas ou a été retiré.</p>
          <button onClick={() => router.push('/avocats')} className="btn btn-primary" id="back-to-avocats">
            ← Retour à l'annuaire
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const icon = SPECIALITE_ICONS[avocat.specialite] ?? '⚖️'

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <button onClick={() => router.push('/avocats')} className={styles.backBtn} id="back-to-directory">
            ← Retour à l'annuaire
          </button>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              {avocat.photo_url ? (
                <img src={avocat.photo_url} alt={avocat.full_name} className={styles.photo} />
              ) : (
                <DefaultAvatar size={120} className={styles.defaultPhoto} />
              )}
              {avocat.disponible && (
                <span className={styles.availableDot} title="Disponible" />
              )}
            </div>
            <div className={styles.info}>
              <span className="badge badge-gold" style={{ marginBottom: 'var(--space-2)', display: 'inline-flex' }}>
                {icon} {avocat.specialite}
              </span>
              <h1 className={styles.name}>Maître {avocat.full_name}</h1>
              <p className={styles.barreau}>Barreau de {avocat.barreau}</p>
              <p className={styles.wilaya}>📍 {avocat.wilaya}</p>
            </div>
          </div>
        </div>
      </section>

      <main className={`container ${styles.main}`}>
        <div className={styles.content}>
          {/* Stats cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{avocat.experience_years}</span>
              <span className={styles.statLabel}>Ans d'expérience</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{avocat.tarif_consultation.toLocaleString('fr-DZ')} DA</span>
              <span className={styles.statLabel}>Tarif consultation</span>
            </div>
            <div className={styles.statCard}>
              <span className={`badge ${avocat.disponible ? 'badge-success' : 'badge-warning'}`}>
                {avocat.disponible ? 'Disponible' : 'Indisponible'}
              </span>
              <span className={styles.statLabel}>Statut</span>
            </div>
          </div>

          {/* Bio */}
          {avocat.bio && (
            <div className={styles.bioSection}>
              <h2 className={styles.sectionTitle}>À propos</h2>
              <div className={styles.divider} />
              <p className={styles.bio}>{avocat.bio}</p>
            </div>
          )}

          {/* Services */}
          <div className={styles.servicesSection}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.divider} />
            <ul className={styles.servicesList}>
              <li>Consultation juridique en personne</li>
              <li>Conseil et accompagnement juridique</li>
              <li>Représentation devant les tribunaux</li>
              <li>Rédaction d'actes juridiques</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Réserver une consultation</h3>
            <p className={styles.sidebarPrice}>
              <span className="badge badge-gold">{avocat.tarif_consultation.toLocaleString('fr-DZ')} DA</span>
            </p>
            <button
              onClick={() => router.push(`/consultation/new?avocat=${avocat.id}`)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-4)' }}
              id="consult-now"
              disabled={!avocat.disponible}
            >
              {avocat.disponible ? 'Consulter maintenant' : 'Indisponible'}
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>📍 Localisation</h3>
            <p className={styles.sidebarText}>{avocat.wilaya}, Algérie</p>
            <p className={styles.sidebarText}>Barreau de {avocat.barreau}</p>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  )
}
