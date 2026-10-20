import {getTranslations} from 'next-intl/server';
import {GITHUB_PROFILE_URL} from '@/lib/constants/site';
import type {Project} from '@/lib/projects/types';
import {ProjectCard} from './ProjectCard';

export async function ProjectGrid({projects}: {projects: Project[]}) {
	if (projects.length === 0) {
		const t = await getTranslations('projects');
		return (
			<div className="text-center py-16" role="status">
				<p className="text-text-secondary text-lg">{t('empty')}</p>
				<a
					href={GITHUB_PROFILE_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block mt-4 text-accent-primary font-medium hover:underline"
				>
					{t('moreOnGitHub')}
				</a>
			</div>
		);
	}

	return (
		// Each ProjectCard spans five of these rows through subgrid, so its bands line up with its neighbours.
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
			{projects.map((project, index) => (
				<ProjectCard key={project.slug} project={project} index={index} />
			))}
		</div>
	);
}
