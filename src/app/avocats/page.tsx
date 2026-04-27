'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AvocatCard from '@/components/AvocatCard'
import { createClient, type Avocat } from '@/lib/supabase'
import styles from './page.module.css'

const SPECIALITES = [
  'Toutes',
  'Droit de la famille',
  'Droit commercial',
  'Droit immobilier',
  'Droit pénal',
  'Droit du travail',
  'Droit des affaires',
  'Droit administratif',
  'Droit civil',
]

const WILAYAS = [
  'Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida',
  'Tizi Ouzou', 'Béjaïa', 'Sétif', 'Batna', 'Tlemcen',
]

// Mock data for demo when Supabase isn't connected
const MOCK_AVOCATS: Avocat[] = [
  {
    id: '1', full_name: 'Karim Mouloud', specialite: 'Droit de la famille',
    wilaya: 'Alger', barreau: 'Alger', experience_years: 12,
    tarif_consultation: 5000, bio: 'Avocat spécialisé en droit de la famille avec plus de 12 ans d\'expérience. Diplômé de l\'université d\'Alger. Intervient dans les affaires de divorce, garde d\'enfants et successions.',
    photo_url: null, disponible: true, created_at: '',
  },
  {
    id: '2', full_name: 'Samira Benali', specialite: 'Droit commercial',
    wilaya: 'Oran', barreau: 'Oran', experience_years: 8,
    tarif_consultation: 7000, bio: 'Experte en droit des affaires et droit commercial. Accompagne les entreprises dans leurs contrats, litiges et créations de sociétés.',
    photo_url: null, disponible: true, created_at: '',
  },
  {
    id: '3', full_name: 'Mohamed Tlemcani', specialite: 'Droit pénal',
    wilaya: 'Constantine', barreau: 'Constantine', experience_years: 20,
    tarif_consultation: 10000, bio: 'Pénaliste reconnu avec 20 ans de barreau. Défenseur des droits, spécialisé en droit pénal général et criminalité économique.',
    photo_url: null, disponible: true, created_at: '',
  },
  {
    id: '4', full_name: 'Nadia Cherif', specialite: 'Droit immobilier',
    wilaya: 'Alger', barreau: 'Alger', experience_years: 6,
    tarif_consultation: 6000, bio: 'Avocate spécialisée en droit immobilier et foncier. Conseille particuliers et promoteurs sur les transactions, litiges de voisinage et VEFA.',
    photo_url: null, disponible: false, created_at: '',
  },
  {
    id: '5', full_name: 'Rachid Boukhalfa', specialite: 'Droit du travail',
    wilaya: 'Annaba', barreau: 'Annaba', experience_years: 15,
    tarif_consultation: 5500, bio: 'Avocat en droit social et droit du travail. Défend salariés et employeurs dans les conflits individuels et collectifs du travail.',
    photo_url: null, disponible: true, created_at: '',
  },
  {
    id: '6', full_name: 'Fatima Hadj-Arab', specialite: 'Droit administratif',
    wilaya: 'Tizi Ouzou', barreau: 'Tizi Ouzou', experience_years: 10,
    tarif_consultation: 4500, bio: 'Spécialisée dans les recours contre les décisions administratives et les marchés publics. Interlocutrice privilégiée des collectivités locales.',
    photo_url: null, disponible: true, created_at: '',
  },
]

export default function AvocatsPage() {
  const supabase = createClient()

  const [avocats, setAvocats] = useState<Avocat[]>(MOCK_AVOCATS)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialite, setSpecialite] = useState('Toutes')
  const [wilaya, setWilaya] = useState('Toutes')

  useEffect(() => {
    async function fetchAvocats() {
      setLoading(true)
      const { data } = await supabase.from('avocats').select('*').order('experience_years', { ascending: false })
      if (data && data.length > 0) setAvocats(data)
      setLoading(false)
    }
    fetchAvocats().catch(() => setLoading(false))
  }, [])

  const filtered = avocats.filter((a) => {
    const matchSearch =
      !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialite.toLowerCase().includes(search.toLowerCase()) ||
      a.wilaya.toLowerCase().includes(search.toLowerCase())
    const matchSpec = specialite === 'Toutes' || a.specialite === specialite
    const matchWilaya = wilaya === 'Toutes' || a.wilaya === wilaya
    return matchSearch && matchSpec && matchWilaya
  })

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Page header */}
      <section className={styles.header}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.headerContent}`}>
          <span className="badge badge-gold" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
            ⚖️ Annuaire Juridique
          </span>
          <h1 className={styles.headerTitle}>Nos Avocats</h1>
          <p className={styles.headerSub}>
            Trouvez l'avocat qui correspond à vos besoins parmi nos {avocats.length}+ experts qualifiés dans toute l'Algérie.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className={styles.filtersSection}>
        <div className={`container ${styles.filters}`}>
          <div className={`form-group ${styles.searchGroup}`}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              id="search-avocats"
              type="text"
              className={`form-input ${styles.searchInput}`}
              placeholder="Rechercher par nom, spécialité, wilaya..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            id="filter-specialite"
            className="form-select"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            {SPECIALITES.map((s) => (
              <option key={s} value={s}>{s === 'Toutes' ? '📂 Toutes spécialités' : s}</option>
            ))}
          </select>

          <select
            id="filter-wilaya"
            className="form-select"
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            {WILAYAS.map((w) => (
              <option key={w} value={w}>{w === 'Toutes' ? '📍 Toutes wilayas' : w}</option>
            ))}
          </select>

          {(search || specialite !== 'Toutes' || wilaya !== 'Toutes') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(''); setSpecialite('Toutes'); setWilaya('Toutes') }}
              id="clear-filters"
            >
              ✕ Effacer
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <main className="section section-sm">
        <div className="container">
          <div className={styles.resultsHeader}>
            <span className={styles.count}>
              {filtered.length} avocat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`skeleton ${styles.skeletonCard}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>Aucun avocat trouvé</h3>
              <p>Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((avocat) => (
                <AvocatCard key={avocat.id} avocat={avocat} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
