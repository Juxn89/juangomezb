import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {NotFoundView} from '@/components/features/NotFoundView';
import './globals.css';

// The root layout lives under [locale], so a URL that matches no route at all has no layout to render
// inside: this page brings its own <html>, styles and fonts (experimental.globalNotFound).
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
	preload: false,
});

export const metadata: Metadata = {
	title: '404 · Page not found | Juan Gómez',
	robots: {index: false},
};

export default function GlobalNotFound() {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="min-h-full">
				<NotFoundView />
			</body>
		</html>
	);
}
