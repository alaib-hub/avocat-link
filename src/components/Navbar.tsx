'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/avocats', label: 'Nos Avocats' },
  ]

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          <span>
            <span className={styles.logoMain}>Avocat</span>
            <span className={styles.logoSub}>Link</span>
          </span>
          <span className={styles.logoBadge}>DZ</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className={styles.actions}>
          {user ? (
            <>
              <Link href="/dashboard" className={`btn btn-outline btn-sm ${styles.dashBtn}`}>
                Mon Espace
              </Link>
              <button onClick={handleSignOut} className={`btn btn-ghost btn-sm`}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">
                Connexion
              </Link>
              <Link href="/auth/register" className="btn btn-gold btn-sm">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          id="mobile-menu-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className={styles.mobileSeparator} />
          {user ? (
            <>
              <Link href="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Mon Espace
              </Link>
              <button onClick={handleSignOut} className={styles.mobileLinkBtn}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Connexion
              </Link>
              <Link href="/auth/register" className={`${styles.mobileLink} ${styles.mobileCta}`} onClick={() => setMenuOpen(false)}>
                S'inscrire gratuitement
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
