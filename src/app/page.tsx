import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

const STATS = [
  { value: '1,200+', label: 'Avocats inscrits' },
  { value: '48', label: 'Wilayas couvertes' },
  { value: '15,000+', label: 'Consultations réalisées' },
  { value: '98%', label: 'Clients satisfaits' },
]

const FEATURES = [
  {
    icon: '🔍',
    title: 'Trouvez votre avocat',
    desc: 'Recherchez parmi des centaines d\'avocats qualifiés selon votre wilaya et votre spécialité juridique.',
  },
  {
    icon: '📅',
    title: 'Réservez en ligne',
    desc: 'Planifiez votre consultation directement en ligne, sans appels ni files d\'attente.',
  },
  {
    icon: '📄',
    title: 'Partagez vos documents',
    desc: 'Uploadez vos dossiers de preuve en toute sécurité directement sur la plateforme.',
  },
  {
    icon: '🔒',
    title: 'Confidentialité garantie',
    desc: 'Vos données sont protégées. Seul votre avocat a accès à votre dossier.',
  },
]

const SPECIALITES = [
  { icon: '👨‍👩‍👧', label: 'Droit de la famille' },
  { icon: '🏢', label: 'Droit commercial' },
  { icon: '🏠', label: 'Droit immobilier' },
  { icon: '⚖️', label: 'Droit pénal' },
  { icon: '👷', label: 'Droit du travail' },
  { icon: '📋', label: 'Droit administratif' },
]

const STEPS = [
  { num: '01', title: 'Créez votre compte', desc: 'Inscription gratuite en 2 minutes.' },
  { num: '02', title: 'Choisissez un avocat', desc: 'Parcourez les profils et choisissez selon votre besoin.' },
  { num: '03', title: 'Réservez & uploadez', desc: 'Sélectionnez un créneau et joignez votre dossier.' },
  { num: '04', title: 'Consultez', desc: 'Rencontrez votre avocat et obtenez des conseils juridiques.' },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className={`badge badge-gold ${styles.heroBadge} animate-fade-up`}>
            🇩🇿 Plateforme Juridique Algérienne
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-up delay-1`}>
            Votre droit,{' '}
            <span className={styles.heroAccent}>simplement</span>
            <br />accessible
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-up delay-2`}>
            Avocat-Link connecte les citoyens algériens avec des avocats qualifiés.
            Consultez un expert juridique en ligne, où que vous soyez en Algérie.
          </p>
          <div className={`${styles.heroCta} animate-fade-up delay-3`}>
            <Link href="/auth/register" className="btn btn-gold btn-lg" id="hero-register-btn">
              Commencer gratuitement
            </Link>
            <Link href="/avocats" className="btn btn-outline-white btn-lg" id="hero-browse-btn">
              Voir les avocats →
            </Link>
          </div>
          <div className={`${styles.heroTrust} animate-fade-up delay-4`}>
            <span>✓ Inscription gratuite</span>
            <span>✓ Avocats vérifiés</span>
            <span>✓ Données sécurisées</span>
          </div>
        </div>
        <div className={styles.heroPattern} />
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialités ── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <div className="divider" />
            <h2 className="section-title">Nos spécialités juridiques</h2>
            <p className="section-subtitle">
              Des avocats experts dans toutes les branches du droit algérien pour vous accompagner.
            </p>
          </div>
          <div className={styles.specialitesGrid}>
            {SPECIALITES.map((s) => (
              <Link
                href={`/avocats?specialite=${encodeURIComponent(s.label)}`}
                key={s.label}
                className={styles.specialiteCard}
              >
                <span className={styles.specialiteIcon}>{s.icon}</span>
                <span className={styles.specialiteLabel}>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div className="divider" />
            <h2 className="section-title">Pourquoi Avocat-Link ?</h2>
            <p className="section-subtitle">
              Une expérience pensée pour rendre le droit accessible à chaque algérien.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`${styles.featureCard} animate-fade-up delay-${i + 1}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <div className="divider" />
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">En 4 étapes simples, bénéficiez d'une consultation juridique professionnelle.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>Besoin d'un conseiller juridique ?</h2>
              <p className={styles.ctaSub}>
                Rejoignez des milliers d'Algériens qui ont déjà trouvé leur avocat sur Avocat-Link.
              </p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/auth/register" className="btn btn-gold btn-lg" id="cta-register-btn">
                S'inscrire maintenant
              </Link>
              <Link href="/avocats" className="btn btn-outline-white" id="cta-browse-btn">
                Parcourir les avocats
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
