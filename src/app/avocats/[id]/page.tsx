'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DefaultAvatar from '@/components/DefaultAvatar'
import { createClient, type Avocat } from '@/lib/supabase'
import styles from './page.module.css'

export default function AvocatProfilePage() {
  const params = useParams()
  const router = useRouter()
  const avocatId = params.id as string
  const supabase = createClient()

  const [avocat, setAvocat] = useState<Avocat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAvocat() {
      const { data, error } = await supabase
        .from('avocats')
        .select('*')
        .eq('id', avocatId)
        .single()
      
      if (data) {
        setAvocat(data)
      }
      setLoading(false)
    }
    fetchAvocat()
  }, [avocatId])

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
          <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!avocat) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.notFound}>
          <h1>Avocat introuvable</h1>
          <p>Le profil que vous cherchez n'existe pas ou a été supprimé.</p>
          <Link href="/avocats" className="btn btn-primary">Retour à la liste</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.headerBg} />
        <div className={`container ${styles.content}`}>
          
          <Link href="/avocats" className={styles.backLink}>
            ← Retour aux avocats
          </Link>

          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              {avocat.photo_url ? (
                <img src={avocat.photo_url} alt={avocat.full_name} className={styles.photo} />
              ) : (
                <DefaultAvatar size={120} className={styles.defaultPhoto} />
              )}
              
              <div className={styles.headerInfo}>
                <div className={styles.titleRow}>
                  <h1 className={styles.name}>Maître {avocat.full_name}</h1>
                  {avocat.disponible ? (
                    <span className="badge badge-success">Disponible</span>
                  ) : (
                    <span className="badge badge-warning">Indisponible</span>
                  )}
                </div>
                
                <p className={styles.specialite}>{avocat.specialite}</p>
                <p className={styles.barreau}>Barreau de {avocat.barreau} • Inscrit(e) en Algérie</p>
                
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{avocat.experience_years} ans</span>
                    <span className={styles.statLabel}>Expérience</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{avocat.tarif_consultation.toLocaleString('fr-DZ')} DA</span>
                    <span className={styles.statLabel}>Consultation</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>📍 {avocat.wilaya}</span>
                    <span className={styles.statLabel}>Localisation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.bodyGrid}>
              <div className={styles.mainInfo}>
                <h2 className={styles.sectionTitle}>À propos de Maître {avocat.full_name}</h2>
                <div className={styles.bio}>
                  {avocat.bio ? (
                    <p>{avocat.bio}</p>
                  ) : (
                    <p className={styles.noBio}>Cet avocat n'a pas encore ajouté de description à son profil.</p>
                  )}
                </div>

                <h2 className={styles.sectionTitle}>Compétences juridiques</h2>
                <div className={styles.skills}>
                  <span className={styles.skillBadge}>{avocat.specialite}</span>
                  <span className={styles.skillBadge}>Conseil juridique</span>
                  <span className={styles.skillBadge}>Représentation au tribunal</span>
                </div>
              </div>

              <div className={styles.actionCard}>
                <h3 className={styles.actionTitle}>Besoin de conseils ?</h3>
                <p className={styles.actionDesc}>
                  Réservez une consultation en ligne avec cet avocat. Vous pourrez joindre vos documents de preuve (PDF) en toute sécurité.
                </p>
                
                <div className={styles.priceTag}>
                  <span>Tarif</span>
                  <strong>{avocat.tarif_consultation.toLocaleString('fr-DZ')} DA</strong>
                </div>

                {avocat.disponible ? (
                  <Link 
                    href={`/consultation/new?avocat=${avocat.id}`}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Demander une consultation
                  </Link>
                ) : (
                  <button className="btn btn-outline btn-lg" disabled style={{ width: '100%', justifyContent: 'center' }}>
                    Actuellement indisponible
                  </button>
                )}
                
                <p className={styles.secureNotice}>
                  🔒 Paiement à effectuer le jour de la consultation.<br/>
                  Vos documents restent strictement confidentiels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
