import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Apply to Be My Crush 💘',
  description: 'Think you have what it takes? Submit your official crush application. Spots are extremely limited.',
  openGraph: {
    title: 'Apply to Be My Crush 💘',
    description: 'Think you have what it takes? Submit your official crush application.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
