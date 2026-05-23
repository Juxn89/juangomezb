import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {getMessages} from 'next-intl/server';
import {routing} from '@/routing';
import {notFound} from 'next/navigation';
import {Providers} from '@/components/providers/Providers';
import {Header} from '@/components/layouts/Header';
import '../globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Juan Gomez - Senior Software Engineer',
	description: 'Building scalable, modern web applications with cutting-edge technologies.',
};

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

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<Providers messages={messages} locale={locale}>
					<Header />
					<main className="flex-1">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
