'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DefaultAvatar from '@/components/DefaultAvatar'
import { createClient, type Consultation } from '@/lib/supabase'
import styles from './page.module.css'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  en_attente:  { label: 'En attente',  badge: 'badge-warning' },
  confirmee:   { label: 'Confirmée',   badge: 'badge-success' },
  terminee:    { label: 'Terminée',    badge: 'badge-info'    },
  annulee:     { label: 'Annulée',     badge: 'badge-error'   },
}

// Mock consultations for demo
const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1', client_id: 'u1', avocat_id: '1',
    date_consultation: new Date(Date.now() + 86400000 * 3).toISOString(),
    statut: 'confirmee', description: 'Affaire de divorce et garde d\'enfants.',
    fichier_url: null, created_at: new Date().toISOString(),
    avocat: { id: '1', full_name: 'Karim Mouloud', specialite: 'Droit de la famille', wilaya: 'Alger', barreau: 'Alger', experience_years: 12, tarif_consultation: 5000, bio: '', photo_url: null, disponible: true, created_at: '' },
  },
  {
    id: 'c2', client_id: 'u1', avocat_id: '2',
    date_consultation: new Date(Date.now() + 86400000 * 10).toISOString(),
    statut: 'en_attente', description: 'Création d\'une SARL et rédaction des statuts.',
    fichier_url: null, created_at: new Date().toISOString(),
    avocat: { id: '2', full_name: 'Samira Benali', specialite: 'Droit commercial', wilaya: 'Oran', barreau: 'Oran', experience_years: 8, tarif_consultation: 7000, bio: '', photo_url: null, disponible: true, created_at: '' },
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-DZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'toutes' | 'en_attente' | 'confirmee' | 'terminee'>('toutes')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }
      setUser(data.user)

      const { data: consults } = await supabase
        .from('consultations')
        .select('*, avocat:avocats(*)')
        .eq('client_id', data.user.id)
        .order('date_consultation', { ascending: true })

      if (consults && consults.length > 0) {
        setConsultations(consults)
      } else {
        setConsultations(MOCK_CONSULTATIONS)
      }
      setLoading(false)
    })
  }, [])

  const filtered = activeTab === 'toutes'
    ? consultations
    : consultations.filter((c) => c.statut === activeTab)

  const counts = {
    toutes: consultations.length,
    en_attente: consultations.filter((c) => c.statut === 'en_attente').length,
    confirmee: consultations.filter((c) => c.statut === 'confirmee').length,
    terminee: consultations.filter((c) => c.statut === 'terminee').length,
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.headerTop}>
            <div className={styles.welcome}>
              <DefaultAvatar size={56} />
              <div>
                <p className={styles.welcomeLabel}>Bienvenue,</p>
                <h1 className={styles.welcomeName}>{userName}</h1>
              </div>
            </div>
            <Link href="/consultation/new" className="btn btn-gold" id="new-consultation-btn">
              + Nouvelle consultation
            </Link>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryNum}>{counts.toutes}</span>
              <span className={styles.summaryLabel}>Total</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={`${styles.summaryNum} ${styles.numWarning}`}>{counts.en_attente}</span>
              <span className={styles.summaryLabel}>En attente</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={`${styles.summaryNum} ${styles.numSuccess}`}>{counts.confirmee}</span>
              <span className={styles.summaryLabel}>Confirmées</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={`${styles.summaryNum} ${styles.numInfo}`}>{counts.terminee}</span>
              <span className={styles.summaryLabel}>Terminées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Consultations */}
      <main className="section section-sm" style={{ flex: 1 }}>
        <div className="container">
          {/* Tabs */}
          <div className={styles.tabs}>
            {(['toutes', 'en_attente', 'confirmee', 'terminee'] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'toutes'     && '📋 Toutes'}
                {tab === 'en_attente' && '⏳ En attente'}
                {tab === 'confirmee'  && '✅ Confirmées'}
                {tab === 'terminee'   && '🏁 Terminées'}
                <span className={styles.tabCount}>{counts[tab]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.list}>
              {[1, 2].map((i) => <div key={i} className={`skeleton ${styles.skeletonItem}`} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <h3>Aucune consultation</h3>
              <p>Vous n'avez pas encore de consultations dans cette catégorie.</p>
              <Link href="/avocats" className="btn btn-primary" id="browse-from-empty" style={{ marginTop: 'var(--space-4)' }}>
                Trouver un avocat
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {filtered.map((c) => {
                const status = STATUS_MAP[c.statut] ?? STATUS_MAP.en_attente
                return (
                  <article key={c.id} className={styles.consultCard}>
                    <div className={styles.consultLeft}>
                      {c.avocat?.photo_url
                        ? <img src={c.avocat.photo_url} alt={c.avocat.full_name} className={styles.consultPhoto} />
                        : <DefaultAvatar size={52} />
                      }
                      <div className={styles.consultInfo}>
                        <h3 className={styles.consultAvocat}>
                          Maître {c.avocat?.full_name ?? 'Avocat'}
                        </h3>
                        <span className={styles.consultSpec}>{c.avocat?.specialite}</span>
                        <span className={styles.consultDate}>
                          📅 {formatDate(c.date_consultation)}
                        </span>
                        <p className={styles.consultDesc}>{c.description}</p>
                      </div>
                    </div>
                    <div className={styles.consultRight}>
                      <span className={`badge ${status.badge}`}>{status.label}</span>
                      {c.fichier_url && (
                        <a
                          href={c.fichier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                          id={`view-file-${c.id}`}
                        >
                          📄 Dossier
                        </a>
                      )}
                      <span className={styles.consultTarif}>
                        {c.avocat?.tarif_consultation?.toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
