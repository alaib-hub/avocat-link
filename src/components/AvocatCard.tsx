import Link from 'next/link'
import DefaultAvatar from './DefaultAvatar'
import type { Avocat } from '@/lib/supabase'
import styles from './AvocatCard.module.css'

type Props = {
  avocat: Avocat
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

export default function AvocatCard({ avocat }: Props) {
  const icon = SPECIALITE_ICONS[avocat.specialite] ?? '⚖️'

  return (
    <article className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          {avocat.photo_url ? (
            <img
              src={avocat.photo_url}
              alt={avocat.full_name}
              className={styles.photo}
            />
          ) : (
            <DefaultAvatar size={72} className={styles.defaultPhoto} />
          )}
          {avocat.disponible && (
            <span className={styles.availableDot} title="Disponible" />
          )}
        </div>

        <div className={styles.meta}>
          <h3 className={styles.name}>Maître {avocat.full_name}</h3>
          <span className={styles.specialite}>
            {icon} {avocat.specialite}
          </span>
          <span className={styles.barreau}>Barreau de {avocat.barreau}</span>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{avocat.experience_years}</span>
          <span className={styles.statLabel}>Ans d'exp.</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{avocat.tarif_consultation.toLocaleString('fr-DZ')}</span>
          <span className={styles.statLabel}>DA / consult.</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>📍</span>
          <span className={styles.statLabel}>{avocat.wilaya}</span>
        </div>
      </div>

      {/* Bio */}
      {avocat.bio && (
        <p className={styles.bio}>{avocat.bio}</p>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Link
          href={`/avocats/${avocat.id}`}
          className={`btn btn-outline btn-sm ${styles.viewBtn}`}
          id={`view-avocat-${avocat.id}`}
        >
          Voir le profil
        </Link>
        <Link
          href={`/consultation/new?avocat=${avocat.id}`}
          className={`btn btn-primary btn-sm ${styles.consultBtn}`}
          id={`consult-avocat-${avocat.id}`}
        >
          Consulter
        </Link>
      </div>

      {/* Status badge */}
      {!avocat.disponible && (
        <div className={styles.unavailableOverlay}>
          <span className="badge badge-warning">Indisponible</span>
        </div>
      )}
    </article>
  )
}
