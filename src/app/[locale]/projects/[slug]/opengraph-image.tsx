import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getProjectBySlug} from '@/lib/projects/get-projects';
import {renderShareImage, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE} from '@/lib/og/share-image';

type Params = {params: Promise<{locale: string; slug: string}>};

export async function generateImageMetadata({params}: {params: {locale: string; slug: string}}) {
	const project = await getProjectBySlug(params.locale, params.slug);
	if (!project) return [];
	return [
		{
			id: 'project',
			alt: `${project.title}: ${project.tagline}`,
			size: SHARE_IMAGE_SIZE,
			contentType: SHARE_IMAGE_TYPE,
		},
	];
}

export default async function Image({params}: Params) {
	const {locale, slug} = await params;
	setRequestLocale(locale);
	const [t, project] = await Promise.all([
		getTranslations({locale, namespace: 'share'}),
		getProjectBySlug(locale, slug),
	]);
	if (!project) notFound();

	return renderShareImage({
		eyebrow: t('caseStudy'),
		title: project.title,
		subtitle: project.tagline,
		metrics: project.metrics,
		footer: 'Juan Carlos Gómez',
	});
}
