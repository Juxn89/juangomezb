import {getTranslations, getLocale} from 'next-intl/server';
import {Sparkles} from 'lucide-react';
import {getPinnedProjects} from '@/lib/github/api';
import {ProjectCard} from './ProjectCard';

export async function ProjectsSection() {
	const t = await getTranslations('projects');
	const locale = await getLocale();

	// Fetch pinned repos from GitHub
	let projects = await getPinnedProjects('juxn89', locale, 4);

	// Fallback to translations if no GitHub data
	if (projects.length === 0) {
		console.warn('No GitHub projects found, using fallback data');
		projects = (t.raw('items') || []) as Array<{
			id: string;
			title: string;
			description: string;
			technologies: string[];
			highlights: string[];
			demoUrl: string;
			codeUrl?: string;
			featured: boolean;
		}>;
	}

	return (
		<section id="projects" className="relative py-20 overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mb-16 text-center">
					<div className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-4 py-2 mb-6">
						<Sparkles className="w-4 h-4 text-accent-primary" />
						<span className="text-sm font-bold text-text-primary">{t('title')}</span>
					</div>

					<h2 className="text-4xl font-bold gradient-text mb-4">{t('title')}</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{projects.map((project, index) => (
						<ProjectCard
							key={project.id}
							project={project}
							index={index}
							viewDemoText={t('viewDemo')}
							viewCodeText={t('viewCode')}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
