import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCatalog} from '@/lib/i18n/catalog';
import {renderShareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE} from '@/lib/og/share-image';

type Params = {params: Promise<{locale: string}>};

// generateImageMetadata rather than a constant alt, so the alt text follows the locale. It runs like
// generateStaticParams, without a request, so it reads the catalog instead of getTranslations.
export async function generateImageMetadata({params}: {params: {locale: string}}) {
	const alt = getCatalog(params.locale)?.share.alt;
	return alt ? [{id: 'site', alt, size: SHARE_IMAGE_SIZE, contentType: SHARE_IMAGE_TYPE}] : [];
}

export default async function Image({params}: Params) {
	const {locale} = await params;
	setRequestLocale(locale);
	const t = await getTranslations({locale, namespace: 'share'});

	return renderShareImage({
		eyebrow: t('role'),
		title: 'Juan Carlos Gómez',
		subtitle: t('tagline'),
		footer: 'Managua, Nicaragua',
	});
}
