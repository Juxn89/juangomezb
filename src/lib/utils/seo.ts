import {Metadata} from 'next';

interface SEOProps {
	title: string;
	description: string;
	locale: 'en' | 'es';
	path?: string;
	image?: string;
	type?: 'website' | 'article';
	publishedTime?: string;
	authors?: string[];
}

export function generateSEOMetadata({
	title,
	description,
	locale,
	path = '',
	image = '/og-image.jpg',
	type = 'website',
	publishedTime,
	authors,
}: SEOProps): Metadata {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';
	const url = `${baseUrl}/${locale}${path}`;
	// Avoid duplicating if title already includes full name and "Portfolio"
	const fullTitle = title.includes('Portfolio') || title.includes('Juan Gómez') ? title : `${title} | Juan Carlos Gómez - Senior Software Engineer`;

	return {
		title: fullTitle,
		description,
		keywords: [
			'Juan Carlos Gómez',
			'Senior Software Engineer',
			'Full Stack Developer',
			'React',
			'Next.js',
			'TypeScript',
			'Node.js',
			'Software Development',
			'Web Development',
			'Cloud Architecture',
			'DevOps',
		],
		authors: authors ? authors.map((name) => ({name})) : [{name: 'Juan Carlos Gómez Bermúdez'}],
		creator: 'Juan Carlos Gómez Bermúdez',
		publisher: 'Juan Carlos Gómez Bermúdez',
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		openGraph: {
			title: fullTitle,
			description,
			url,
			siteName: 'Juan Carlos Gómez - Portfolio',
			images: [
				{
					url: `${baseUrl}${image}`,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			locale: locale === 'en' ? 'en_US' : 'es_ES',
			type,
			...(publishedTime && {publishedTime}),
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description,
			images: [`${baseUrl}${image}`],
			creator: '@juxn89',
		},
		alternates: {
			canonical: url,
			languages: {
				en: `${baseUrl}/en${path}`,
				es: `${baseUrl}/es${path}`,
			},
		},
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION,
		},
		icons: {
			icon: [
				{url: '/favicon.svg', type: 'image/svg+xml'},
			],
			shortcut: '/favicon.svg',
			apple: '/apple-touch-icon.png',
		},
	};
}

/**
 * Generate JSON-LD structured data for Person schema
 */
export function generatePersonSchema(_locale: 'en' | 'es') {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';

	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Juan Carlos Gómez Bermúdez',
		alternateName: 'Juan Gomez',
		url: baseUrl,
		image: `${baseUrl}/images/profile_photo.png`,
		jobTitle: 'Senior Software Engineer',
		worksFor: {
			'@type': 'Organization',
			name: 'Freelance',
		},
		email: 'gb.jc@outlook.com',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Managua',
			addressCountry: 'NI',
		},
		sameAs: [
			'https://github.com/juxn89',
			'https://www.linkedin.com/in/jcgomez89/',
			'https://twitter.com/juxn89',
		],
		knowsAbout: [
			'Software Development',
			'Full Stack Development',
			'React',
			'Next.js',
			'TypeScript',
			'Node.js',
			'Cloud Architecture',
			'DevOps',
			'AWS',
			'PostgreSQL',
		],
	};
}

/**
 * Generate JSON-LD structured data for WebSite schema
 */
export function generateWebSiteSchema(locale: 'en' | 'es') {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';

	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Juan Carlos Gómez - Portfolio',
		alternateName: 'Juan Gomez Portfolio',
		url: baseUrl,
		description:
			locale === 'en'
				? 'Senior Software Engineer specializing in full-stack development, cloud architecture, and modern web technologies.'
				: 'Ingeniero de Software Senior especializado en desarrollo full-stack, arquitectura en la nube y tecnologías web modernas.',
		inLanguage: locale === 'en' ? 'en-US' : 'es-ES',
		author: {
			'@type': 'Person',
			name: 'Juan Carlos Gómez Bermúdez',
		},
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${baseUrl}/${locale}?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(
	items: Array<{name: string; url: string}>,
	_locale: 'en' | 'es'
) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: `${baseUrl}${item.url}`,
		})),
	};
}
