import en from '../../../messages/en.json';
import es from '../../../messages/es.json';

export type Messages = typeof en;

// One entry per locale in src/routing.ts; messages-parity.test.ts keeps both catalogs with the same shape.
const CATALOGS: Record<string, Messages> = {en, es};

/**
 * The messages for a locale, read without a request. next-intl's getTranslations resolves the locale from
 * request headers, which do not exist in generateStaticParams, generateImageMetadata or the sitemap.
 */
export function getCatalog(locale: string): Messages | undefined {
	return Object.hasOwn(CATALOGS, locale) ? CATALOGS[locale] : undefined;
}
