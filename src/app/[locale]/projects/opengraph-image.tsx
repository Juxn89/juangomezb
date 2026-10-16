import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCatalog} from '@/lib/i18n/catalog';
import {renderShareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE} from '@/lib/og/share-image';

type Params = {params: Promise<{locale: string}>};

// Runs without a request, like generateStaticParams, so it reads the catalog instead of getTranslations.
export async function generateImageMetadata({params}: {params: {locale: string}}) {
	const alt = getCatalog(params.locale)?.projects.index.metaDescription;
	return alt ? [{id: 'projects', alt, size: SHARE_IMAGE_SIZE, contentType: SHARE_IMAGE_TYPE}] : [];
}

export default async function Image({params}: Params) {
	const {locale} = await params;
	setRequestLocale(locale);
	const [t, share] = await Promise.all([
		getTranslations({locale, namespace: 'projects'}),
		getTranslations({locale, namespace: 'share'}),
	]);

	return renderShareImage({
		eyebrow: share('role'),
		title: t('index.title'),
		subtitle: t('subtitle'),
		footer: 'Juan Carlos Gómez',
	});
}
