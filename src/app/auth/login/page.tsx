'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect. Veuillez réessayer.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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
            Votre conseiller juridique,<br />à portée de main.
          </h2>
          <p className={styles.panelSub}>
            Connectez-vous pour accéder à votre espace personnel et gérer vos consultations.
          </p>
          <div className={styles.panelStats}>
            <div className={styles.panelStat}>
              <span className={styles.panelStatNum}>1,200+</span>
              <span className={styles.panelStatLabel}>Avocats</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.panelStatNum}>48</span>
              <span className={styles.panelStatLabel}>Wilayas</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.panelStatNum}>15k+</span>
              <span className={styles.panelStatLabel}>Consultations</span>
            </div>
          </div>
        </div>
        <div className={styles.panelBg} />
      </div>

      {/* Form */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Connexion</h1>
            <p className={styles.formSubtitle}>
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className={styles.formLink} id="go-to-register">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Adresse email <span>*</span>
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Mot de passe <span>*</span>
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              disabled={loading}
              id="login-submit"
            >
              {loading ? <span className="spinner" /> : 'Se connecter'}
            </button>
          </form>

          <div className={styles.dividerLine}>
            <span>ou</span>
          </div>

          <Link
            href="/avocats"
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
            id="browse-without-login"
          >
            🔍 Parcourir les avocats sans se connecter
          </Link>

          <p className={styles.terms}>
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className={styles.formLink}>Conditions d'utilisation</a> et notre{' '}
            <a href="#" className={styles.formLink}>Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
