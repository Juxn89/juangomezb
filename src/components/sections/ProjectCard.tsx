'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {ArrowRight, ExternalLink, PlayCircle} from 'lucide-react';
import {Badge} from '@/components/ui/Badge';
import {GithubIcon} from '@/components/ui/GithubIcon';
import {LinkButton} from '@/components/ui/LinkButton';
import type {Project} from '@/lib/projects/types';

interface ProjectCardProps {
	project: Project;
	index: number;
}

export function ProjectCard({project, index}: ProjectCardProps) {
	const t = useTranslations('projects');
	const caseStudyHref = `/projects/${project.slug}`;

	return (
		<motion.article
			initial={{opacity: 0, y: 30}}
			whileInView={{opacity: 1, y: 0}}
			transition={{duration: 0.5, delay: index * 0.1}}
			viewport={{once: true}}
			className="group relative"
			aria-labelledby={`project-${project.slug}`}
		>
			<div className="relative h-full rounded-2xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/10 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
				<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<div className="relative z-10 flex flex-col h-full">
					<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
						<Badge>{t(`kind.${project.kind}`)}</Badge>
						<Badge variant="success">{t(`status.${project.status}`)}</Badge>
						<span>{project.year}</span>
					</div>

					<h3
						id={`project-${project.slug}`}
						className="text-2xl font-bold text-text-primary mb-3 break-words group-hover:text-accent-primary transition-colors"
					>
						{project.title}
					</h3>
					<p className="text-text-secondary leading-relaxed mb-6">{project.tagline}</p>

					<dl className="mb-6 grid grid-cols-2 gap-3" aria-label={t('metricsLabel')}>
						{project.metrics.map((metric) => (
							// Column-reverse shows the value first while the markup keeps the dt/dd order.
							<div key={metric.label} className="flex flex-col-reverse justify-end rounded-xl border border-border bg-bg-primary p-3">
								<dt className="mt-1 text-xs leading-snug text-text-secondary">{metric.label}</dt>
								<dd className="text-xl font-bold text-accent-primary">{metric.value}</dd>
							</div>
						))}
					</dl>

					<div className="mt-auto space-y-5">
						<ul className="flex flex-wrap gap-2" aria-label={t('stackLabel')}>
							{project.stack.map((tech) => (
								<li
									key={tech}
									className="rounded-lg bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary border border-border"
								>
									{tech}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3">
							<LinkButton href={caseStudyHref} external={false} icon={<ArrowRight className="w-4 h-4" />}>
								{t('viewCaseStudy')}
							</LinkButton>
							{project.video && (
								<LinkButton
									href={`${caseStudyHref}#demo`}
									external={false}
									variant="secondary"
									icon={<PlayCircle className="w-4 h-4" />}
								>
									{t('watchVideo')}
								</LinkButton>
							)}
							{project.demoUrl && (
								<LinkButton href={project.demoUrl} variant="secondary" icon={<ExternalLink className="w-4 h-4" />}>
									{t('viewDemo')}
								</LinkButton>
							)}
							{project.repoUrl && (
								<LinkButton href={project.repoUrl} variant="secondary" icon={<GithubIcon className="w-4 h-4" />}>
									{t('viewCode')}
								</LinkButton>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.article>
	);
}
