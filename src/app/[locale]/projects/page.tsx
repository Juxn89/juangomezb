import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {GITHUB_PROFILE_URL} from '@/lib/constants/site';
import {getProjects} from '@/lib/projects/get-projects';
import {generateSEOMetadata} from '@/lib/utils/seo';
import {GithubIcon} from '@/components/ui/GithubIcon';
import {LinkButton} from '@/components/ui/LinkButton';
import {ProjectGrid} from '@/components/sections/ProjectGrid';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'projects.index'});

	return generateSEOMetadata({
		title: t('metaTitle'),
		description: t('metaDescription'),
		locale: locale as 'en' | 'es',
		path: '/projects',
	});
}

export default async function ProjectsPage({params}: Props) {
	const {locale} = await params;
	setRequestLocale(locale);

	const [t, projects] = await Promise.all([
		getTranslations({locale, namespace: 'projects'}),
		getProjects(locale),
	]);

	return (
		<section className="py-16 sm:py-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<header className="mb-14 max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4 pb-1 leading-tight">
						{t('index.title')}
					</h1>
					<p className="text-lg text-text-secondary">{t('index.subtitle')}</p>
				</header>

				<ProjectGrid projects={projects} />

				{projects.length > 0 && (
					<div className="mt-14 flex justify-center">
						<LinkButton href={GITHUB_PROFILE_URL} variant="secondary" icon={<GithubIcon className="w-4 h-4" />}>
							{t('moreOnGitHub')}
						</LinkButton>
					</div>
				)}
			</div>
		</section>
	);
}
