import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({ subsets: ['latin'], weight: ['300', '600'] })

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
      <body className={ `${openSans.className} main-container` }>{children}</body>
    </html>
  )
}
