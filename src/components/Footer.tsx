import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>⚖️</span>
            <span className={styles.logoText}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'white' }}>Avocat</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, color: 'var(--color-gold)' }}>Link</span>
              <span className={styles.logoBadge}>DZ</span>
            </span>
          </div>
          <p className={styles.tagline}>
            La plateforme juridique de confiance qui connecte les citoyens algériens avec les meilleurs avocats.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.social}>f</a>
            <a href="#" aria-label="Instagram" className={styles.social}>in</a>
            <a href="#" aria-label="LinkedIn" className={styles.social}>li</a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navigation</h4>
          <Link href="/" className={styles.colLink}>Accueil</Link>
          <Link href="/avocats" className={styles.colLink}>Nos Avocats</Link>
          <Link href="/auth/register" className={styles.colLink}>S'inscrire</Link>
          <Link href="/auth/login" className={styles.colLink}>Connexion</Link>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Spécialités</h4>
          <span className={styles.colText}>Droit de la famille</span>
          <span className={styles.colText}>Droit commercial</span>
          <span className={styles.colText}>Droit immobilier</span>
          <span className={styles.colText}>Droit pénal</span>
          <span className={styles.colText}>Droit du travail</span>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contact</h4>
          <span className={styles.colText}>📍 Alger, Algérie</span>
          <span className={styles.colText}>📞 +213 21 XX XX XX</span>
          <span className={styles.colText}>✉️ contact@avocat-link.dz</span>
          <div className={styles.wilayas}>
            <span className={styles.wilaya}>Alger</span>
            <span className={styles.wilaya}>Oran</span>
            <span className={styles.wilaya}>Constantine</span>
            <span className={styles.wilaya}>Annaba</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span>© {year} Avocat-Link. Tous droits réservés.</span>
            <span className={styles.legal}>
              Plateforme juridique algérienne — Conforme à la loi 18-07
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
