import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'

const font = Onest({ 
	subsets: ['latin'], 
	weight: ['100'], 
	style: ['normal'], 
	display: 'swap'
})

export const metadata: Metadata = {
  title: `Juan Gómez's portfolio - Full Stack Web Developer and programmer with +9 years of experience`,
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
	params,
  children,
}: {
	params: { lang: string },
  children: React.ReactNode
}) {
	const title = params.lang === 'en' 
		? `Juan Gómez's portfolio - Full Stack Web Developer and programmer with +9 years of experience` 
		: `Portafolio de Juan Gómez - Desarrollador Full Stack con +9 años de experiencia`

  return (
    <html lang={ params.lang }>
			<head>
				<link rel='icon' type='image/svg' href='/assets/svg/logos/logo.svg' sizes='114x114'/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="canonical" href="https://juangomezb.com" />
				<title>{ title }</title>
			</head>
      <body className={ `${font.className} bg-slate-900 relative` }>
				{children}
			</body>
    </html>
  )
}
