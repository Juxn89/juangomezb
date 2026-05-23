import {redirect} from 'next/navigation';
import {routing} from '@/routing';

// This page only renders when the user visits `/` without a locale
export default function RootPage() {
	// Redirect to the default locale
	redirect(`/${routing.defaultLocale}`);
}
