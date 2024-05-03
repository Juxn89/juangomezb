import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({ subsets: ['latin'], weight: ['300', '600'] })

export const metadata: Metadata = {
  title: 'Juan Gómez',
  description: `Juan Gómez's Personal portfolio`,
	authors: {
		name: 'Juan Gómez',
		url: 'https://juangomezb.com'
	},
	openGraph: {
		url: 'https://juangomezb.com',
		type: 'profile',
		locale: 'en_US.utf-8',
		siteName: `Juan Gómez's personal portfolio`,
		description: `Juan Gómez's personal portfolio`,
		images: 'https://juangomezb.com/assets/img/jgomez_profile_picture_00.jfif'
	},
	twitter: { 
		site: '@jc_gomez89',
		title: `Juan Gómez's personal portfolio`,
		card: 'summary_large_image',
		images: 'https://juangomezb.com/assets/img/jgomez_profile_picture_00.jfif'
	},
	robots: {
		follow: true,
		index: true
	},
	keywords: [ '.NET', 'Developer', 'DotNet', 'Juan', 'Gómez', 'Juan Gómez', 'Software', 'Engineer', 'Latam' ]
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
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="canonical" href="https://juangomezb.com" />
			</head>
      <body className={ `${openSans.className} main-container` }>{children}</body>
    </html>
  )
}
