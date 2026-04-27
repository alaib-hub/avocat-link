import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Avocat-Link — Trouvez votre avocat en Algérie',
  description:
    'Plateforme juridique algérienne connectant les clients avec des avocats qualifiés. Réservez votre consultation en ligne.',
  keywords: 'avocat algérie, consultation juridique, avocat en ligne, droit algérien',
  openGraph: {
    title: 'Avocat-Link',
    description: 'Votre plateforme juridique de confiance en Algérie',
    locale: 'fr_DZ',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
