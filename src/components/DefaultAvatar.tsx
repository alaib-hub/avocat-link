import styles from './DefaultAvatar.module.css'

type Props = {
  size?: number
  className?: string
}

/** Facebook/Instagram-style grey silhouette avatar */
export default function DefaultAvatar({ size = 64, className = '' }: Props) {
  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Photo de profil par défaut"
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Head */}
        <circle cx="50" cy="35" r="20" fill="rgba(255,255,255,0.85)" />
        {/* Body/shoulders */}
        <path
          d="M10 95 C10 68 90 68 90 95"
          fill="rgba(255,255,255,0.85)"
        />
      </svg>
    </div>
  )
}
