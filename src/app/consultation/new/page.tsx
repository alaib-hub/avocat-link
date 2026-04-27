'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DefaultAvatar from '@/components/DefaultAvatar'
import { createClient, type Avocat } from '@/lib/supabase'
import styles from './page.module.css'

const MOCK_AVOCATS: Record<string, Avocat> = {
  '1': { id: '1', full_name: 'Karim Mouloud', specialite: 'Droit de la famille', wilaya: 'Alger', barreau: 'Alger', experience_years: 12, tarif_consultation: 5000, bio: 'Avocat spécialisé en droit de la famille avec plus de 12 ans d\'expérience. Diplômé de l\'université d\'Alger.', photo_url: null, disponible: true, created_at: '' },
  '2': { id: '2', full_name: 'Samira Benali', specialite: 'Droit commercial', wilaya: 'Oran', barreau: 'Oran', experience_years: 8, tarif_consultation: 7000, bio: 'Experte en droit des affaires et droit commercial.', photo_url: null, disponible: true, created_at: '' },
  '3': { id: '3', full_name: 'Mohamed Tlemcani', specialite: 'Droit pénal', wilaya: 'Constantine', barreau: 'Constantine', experience_years: 20, tarif_consultation: 10000, bio: 'Pénaliste reconnu avec 20 ans de barreau.', photo_url: null, disponible: true, created_at: '' },
  '4': { id: '4', full_name: 'Nadia Cherif', specialite: 'Droit immobilier', wilaya: 'Alger', barreau: 'Alger', experience_years: 6, tarif_consultation: 6000, bio: 'Avocate spécialisée en droit immobilier et foncier.', photo_url: null, disponible: false, created_at: '' },
  '5': { id: '5', full_name: 'Rachid Boukhalfa', specialite: 'Droit du travail', wilaya: 'Annaba', barreau: 'Annaba', experience_years: 15, tarif_consultation: 5500, bio: 'Avocat en droit social et droit du travail.', photo_url: null, disponible: true, created_at: '' },
  '6': { id: '6', full_name: 'Fatima Hadj-Arab', specialite: 'Droit administratif', wilaya: 'Tizi Ouzou', barreau: 'Tizi Ouzou', experience_years: 10, tarif_consultation: 4500, bio: 'Spécialisée dans les recours contre les décisions administratives.', photo_url: null, disponible: true, created_at: '' },
}

function NewConsultationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const avocatId = searchParams.get('avocat') ?? ''
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [avocat, setAvocat] = useState<Avocat | null>(null)
  const [form, setForm] = useState({
    avocat_id: avocatId,
    date_consultation: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fetchingAvocat, setFetchingAvocat] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login')
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    if (!form.avocat_id) return
    setFetchingAvocat(true)
    const fetchAvocat = async () => {
      try {
        const { data } = await supabase
          .from('avocats')
          .select('*')
          .eq('id', form.avocat_id)
          .single()
        if (data) setAvocat(data)
        else setAvocat(MOCK_AVOCATS[form.avocat_id] ?? null)
      } catch {
        setAvocat(MOCK_AVOCATS[form.avocat_id] ?? null)
      } finally {
        setFetchingAvocat(false)
      }
    }
    fetchAvocat()
  }, [form.avocat_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }
    if (!form.avocat_id) { setError('Veuillez sélectionner un avocat.'); return }
    if (!file) { setError('Veuillez joindre votre dossier de preuve (PDF).'); return }

    setLoading(true)
    setError('')

    // 1. Upload the file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dossiers')
      .upload(fileName, file)

    if (uploadError) {
      setError(`Erreur d'upload: ${uploadError.message}`)
      setLoading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dossiers')
      .getPublicUrl(uploadData.path)

    // 2. Insert consultation record
    const { error: insertError } = await supabase.from('consultations').insert({
      client_id: user.id,
      avocat_id: form.avocat_id,
      date_consultation: form.date_consultation,
      description: form.description,
      statut: 'en_attente',
      fichier_url: publicUrl,
    })

    if (insertError) {
      setError(`Erreur: ${insertError.message}`)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.successTitle}>Consultation demandée !</h2>
        <p className={styles.successText}>
          Votre demande de consultation a été envoyée avec succès. L'avocat vous contactera pour confirmer le rendez-vous.
        </p>
        <div className={styles.successBtns}>
          <button onClick={() => router.push('/dashboard')} className="btn btn-primary btn-lg" id="go-dashboard-after-consult">
            Voir mon tableau de bord
          </button>
          <button onClick={() => { setSuccess(false); setForm({ avocat_id: '', date_consultation: '', description: '' }); setFile(null) }} className="btn btn-ghost">
            Nouvelle consultation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Nouvelle consultation</h1>
          <p className={styles.formSub}>Remplissez ce formulaire pour réserver votre consultation juridique.</p>
        </div>

        {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

        {/* Avocat preview */}
        {avocat && (
          <div className={styles.avocatPreview}>
            {avocat.photo_url
              ? <img src={avocat.photo_url} alt={avocat.full_name} className={styles.previewPhoto} />
              : <DefaultAvatar size={56} />
            }
            <div>
              <div className={styles.previewName}>Maître {avocat.full_name}</div>
              <div className={styles.previewMeta}>{avocat.specialite} — {avocat.wilaya}</div>
              <div className={styles.previewTarif}>
                <span className="badge badge-gold">{avocat.tarif_consultation.toLocaleString('fr-DZ')} DA</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} id="consultation-form">
          {!avocatId && (
            <div className="form-group">
              <label className="form-label" htmlFor="select-avocat-id">
                ID de l'avocat <span>*</span>
              </label>
              <input
                id="select-avocat-id"
                type="text"
                className="form-input"
                placeholder="Entrez l'ID de l'avocat"
                value={form.avocat_id}
                onChange={(e) => setForm({ ...form, avocat_id: e.target.value })}
                required
              />
              <span className="form-error">Sélectionnez un avocat depuis la <a href="/avocats" style={{ color: 'var(--color-primary)' }}>liste des avocats</a>.</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="date-consultation">
              Date souhaitée <span>*</span>
            </label>
            <input
              id="date-consultation"
              type="datetime-local"
              className="form-input"
              value={form.date_consultation}
              onChange={(e) => setForm({ ...form, date_consultation: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description-case">
              Description de votre affaire <span>*</span>
            </label>
            <textarea
              id="description-case"
              className="form-textarea"
              placeholder="Décrivez brièvement votre situation juridique et vos besoins..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dossier-upload">
              Dossier de preuve (PDF) <span>*</span>
            </label>
            <div className={styles.fileUpload}>
              <input
                id="dossier-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className={styles.fileInput}
                required
              />
              <div className={styles.fileLabel}>
                <span className={styles.fileIcon}>📎</span>
                <span>
                  {file
                    ? <><strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} Mo)</>
                    : 'Cliquez pour joindre votre dossier PDF'}
                </span>
              </div>
            </div>
            <span className="form-error" style={{ color: 'var(--color-text-muted)' }}>
              Formats acceptés : PDF, DOC, DOCX — Max 10 Mo
            </span>
          </div>

          <div className={styles.legalNotice}>
            🔒 Vos documents sont chiffrés et stockés de manière sécurisée. Seul l'avocat sélectionné y aura accès.
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            disabled={loading}
            id="submit-consultation"
          >
            {loading ? <><span className="spinner" /> Envoi en cours...</> : '📋 Envoyer la demande de consultation'}
          </button>
        </form>
      </div>

      {/* Sidebar info */}
      <div className={styles.sidebar}>
        <div className={styles.sideCard}>
          <h3 className={styles.sideTitle}>📌 Comment ça marche</h3>
          <ol className={styles.sideSteps}>
            <li>Remplissez le formulaire et joignez votre dossier</li>
            <li>L'avocat reçoit votre demande et la confirme</li>
            <li>Vous recevez une notification de confirmation</li>
            <li>Rencontrez votre avocat à la date convenue</li>
          </ol>
        </div>
        <div className={styles.sideCard}>
          <h3 className={styles.sideTitle}>🔒 Confidentialité</h3>
          <p className={styles.sidePara}>
            Toutes les communications et documents échangés sur Avocat-Link sont strictement confidentiels, conformément au secret professionnel de l'avocat.
          </p>
        </div>
        <div className={styles.sideCard}>
          <h3 className={styles.sideTitle}>💬 Besoin d'aide ?</h3>
          <p className={styles.sidePara}>
            Notre équipe est disponible du dimanche au jeudi, de 8h à 17h.
          </p>
          <a href="tel:+21321000000" className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-3)' }}>
            📞 +213 21 00 00 00
          </a>
        </div>
      </div>
    </div>
  )
}

export default function NewConsultationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <section className={styles.pageHeader}>
        <div className={styles.headerBg} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-gold" style={{ display: 'inline-flex', marginBottom: 'var(--space-3)' }}>
            📋 Nouvelle demande
          </span>
          <h1 className={styles.pageTitle}>Demande de Consultation</h1>
          <p className={styles.pageSub}>Remplissez le formulaire ci-dessous pour prendre rendez-vous avec un avocat.</p>
        </div>
      </section>
      <main className="section section-sm" style={{ flex: 1 }}>
        <div className="container">
          <Suspense fallback={<div className="skeleton" style={{ height: 400, borderRadius: 16 }} />}>
            <NewConsultationForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
