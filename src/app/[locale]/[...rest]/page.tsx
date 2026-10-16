import {notFound} from 'next/navigation';

// Any path under a locale that no page matches (e.g. /es/no-existe) renders [locale]/not-found.tsx inside
// the locale layout: translated, with the header and footer. Without this catch-all it fell through to
// the English global 404.
export default function CatchAllNotFound() {
	notFound();
}
