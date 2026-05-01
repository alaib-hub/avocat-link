'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from '../auth.module.css'

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou',
  'Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba',
  'Guelma','Constantine','Médéa','Mostaganem','MSila','Mascara','Ouargla',
  'Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf',
  'Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila',
  'Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane',
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    wilaya: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: form.full_name,
          phone: form.phone,
          wilaya: form.wilaya,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Insert into profiles table
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        wilaya: form.wilaya,
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successScreen}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Inscription réussie !</h2>
          <p className={styles.successText}>
            Vérifiez votre boîte mail pour confirmer votre adresse email.
            Après confirmation, vous pourrez vous connecter.
          </p>
          <Link href="/auth/login" className="btn btn-primary btn-lg" id="go-to-login-after-register">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.logo}>
            <span>⚖️</span>
            <span>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>Avocat</span>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>Link</span>
            </span>
          </Link>
          <h2 className={styles.panelTitle}>
            Rejoignez des milliers d'Algériens qui ont trouvé leur avocat.
          </h2>
          <p className={styles.panelSub}>
            Inscription gratuite. Accédez instantanément à nos avocats vérifiés dans toutes les wilayas.
          </p>
          <ul className={styles.panelBenefits}>
            <li>✓ Accès à tous les profils d'avocats</li>
            <li>✓ Réservation de consultation en ligne</li>
            <li>✓ Upload sécurisé de dossiers</li>
            <li>✓ Suivi de vos consultations</li>
          </ul>
        </div>
        <div className={styles.panelBg} />
      </div>

      {/* Form */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Créer un compte</h1>
            <p className={styles.formSubtitle}>
              Déjà inscrit ?{' '}
              <Link href="/auth/login" className={styles.formLink} id="go-to-login">
                Se connecter
              </Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className={styles.form} id="register-form">
            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Nom complet <span>*</span>
                </label>
                <input
                  id="reg-name"
                  name="full_name"
                  type="text"
                  className="form-input"
                  placeholder="Ahmed Benali"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">
                  Téléphone <span>*</span>
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+213 5X XX XX XX"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Adresse email <span>*</span>
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-wilaya">
                Wilaya <span>*</span>
              </label>
              <select
                id="reg-wilaya"
                name="wilaya"
                className="form-select"
                value={form.wilaya}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez votre wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Mot de passe <span>*</span>
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Min. 6 caractères"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirmer <span>*</span>
                </label>
                <input
                  id="reg-confirm"
                  name="confirm"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              disabled={loading}
              id="register-submit"
            >
              {loading ? <span className="spinner" /> : 'Créer mon compte gratuitement'}
            </button>
          </form>

          <p className={styles.terms}>
            En vous inscrivant, vous acceptez nos{' '}
            <a href="#" className={styles.formLink}>Conditions d'utilisation</a> et notre{' '}
            <a href="#" className={styles.formLink}>Politique de confidentialité</a> conformes à la loi algérienne 18-07.
          </p>
        </div>
      </div>
    </div>
  )
}
