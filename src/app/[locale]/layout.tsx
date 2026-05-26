import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/routing';
import {notFound} from 'next/navigation';
import {Analytics} from '@vercel/analytics/react';
import {Providers} from '@/components/providers/Providers';
import {Header} from '@/components/layouts/Header';
import {Footer} from '@/components/layouts/Footer';
import {generateSEOMetadata, generatePersonSchema, generateWebSiteSchema} from '@/lib/utils/seo';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
	preload: true,
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
	preload: false,
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{locale: string}>;
}): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'hero'});

	const title = t('title');
	const description = t('description');

	return generateSEOMetadata({
		title,
		description,
		locale: locale as 'en' | 'es',
		path: '',
	});
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{locale: string}>;
}>) {
	const {locale} = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Load messages for the specific locale
	const messages = await getMessages({locale});

	// Generate structured data schemas
	const personSchema = generatePersonSchema(locale as 'en' | 'es');
	const websiteSchema = generateWebSiteSchema(locale as 'en' | 'es');

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{__html: JSON.stringify(personSchema)}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}}
				/>
			</head>
			<body className="min-h-full flex flex-col">
				<Providers messages={messages} locale={locale}>
					<Header />
					<main className="flex-1">
						{children}
					</main>
					<Footer />
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
