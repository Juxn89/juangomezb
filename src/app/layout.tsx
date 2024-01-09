import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Juan Gómez',
  description: 'Personal portafolio',
	authors: {
		name: 'Juan Gómez',
		url: 'https://juangomezb.com'
	},
	openGraph: { },
	twitter: { },
	robots: {
		follow: true,
		index: true
	},
	keywords: [ '.NET', 'Developer', 'DotNet' ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
			<head>
				<link rel='icon' type='image/svg' href='/assets/svg/logos/logo.svg' sizes='114x114'/>
			</head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
