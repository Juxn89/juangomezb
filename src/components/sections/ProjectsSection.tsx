import {getTranslations, getLocale} from 'next-intl/server';
import {ArrowRight, Sparkles} from 'lucide-react';
import {Link} from '@/routing';
import {getFeaturedProjects} from '@/lib/projects/get-projects';
import {ProjectGrid} from './ProjectGrid';

export async function ProjectsSection() {
	const locale = await getLocale();
	const [t, projects] = await Promise.all([
		getTranslations({locale, namespace: 'projects'}),
		getFeaturedProjects(locale),
	]);

	return (
		<section id="projects" className="relative py-20 overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<div className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-4 py-2 mb-6">
						<Sparkles className="w-4 h-4 text-accent-primary" />
						<span className="text-sm font-bold text-text-primary">{t('title')}</span>
					</div>

					<h2 className="text-4xl font-bold gradient-text mb-4 pb-1 leading-tight">{t('title')}</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
				</div>

				<ProjectGrid projects={projects} />

				{projects.length > 0 && (
					<div className="text-center mt-12">
						<Link
							href="/projects"
							className="inline-flex items-center gap-2 font-medium text-accent-primary hover:underline"
						>
							{t('viewAll')}
							<ArrowRight className="w-4 h-4" aria-hidden="true" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
