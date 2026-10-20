'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {ArrowRight, ExternalLink, PlayCircle} from 'lucide-react';
import {Badge} from '@/components/ui/Badge';
import {GithubIcon} from '@/components/ui/GithubIcon';
import {LinkButton} from '@/components/ui/LinkButton';
import {cn} from '@/lib/utils/cn';
import type {Project} from '@/lib/projects/types';

interface ProjectCardProps {
	project: Project;
	index: number;
}

/**
 * The card spans five rows of ProjectGrid's grid and shares them through subgrid (header, tagline,
 * metrics, stack, actions), so every band starts at the same height in every card of a row,
 * whatever the length of each project's text.
 */
export function ProjectCard({project, index}: ProjectCardProps) {
	const t = useTranslations('projects');
	const reduceMotion = useReducedMotion();
	const caseStudyHref = `/projects/${project.slug}`;

	const secondaryActions = [
		project.video && {
			href: `${caseStudyHref}#demo`,
			external: false,
			icon: <PlayCircle className="w-4 h-4" />,
			label: t('watchVideo'),
		},
		project.demoUrl && {
			href: project.demoUrl,
			external: true,
			icon: <ExternalLink className="w-4 h-4" />,
			label: t('viewDemo'),
		},
		project.repoUrl && {
			href: project.repoUrl,
			external: true,
			icon: <GithubIcon className="w-4 h-4" />,
			label: t('viewCode'),
		},
	].filter((action) => !!action);

	return (
		<motion.article
			initial={{opacity: 0, y: 30}}
			whileInView={{opacity: 1, y: 0}}
			whileHover={reduceMotion ? undefined : {y: -4}}
			transition={{duration: 0.5, delay: index * 0.1}}
			viewport={{once: true}}
			className="group relative row-span-5 grid grid-rows-subgrid gap-y-5 rounded-2xl border border-border bg-bg-secondary p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/10"
			aria-labelledby={`project-${project.slug}`}
		>
			<div
				className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				aria-hidden="true"
			/>

			<header className="relative">
				<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
					<Badge>{t(`kind.${project.kind}`)}</Badge>
					<Badge variant="success">{t(`status.${project.status}`)}</Badge>
					<span>{project.year}</span>
				</div>
				<h3
					id={`project-${project.slug}`}
					className="text-2xl font-bold text-text-primary break-words group-hover:text-accent-primary transition-colors"
				>
					{project.title}
				</h3>
			</header>

			<p className="relative text-text-secondary leading-relaxed">{project.tagline}</p>

			{/* auto-rows-fr: the four tiles share one height, so a three-line label does not make one row taller. */}
			<dl className="relative grid grid-cols-2 auto-rows-fr gap-3" aria-label={t('metricsLabel')}>
				{project.metrics.map((metric) => (
					// Column-reverse shows the value first while the markup keeps the dt/dd order.
					<div
						key={metric.label}
						className="flex flex-col-reverse justify-end rounded-xl border border-border bg-bg-primary p-3"
					>
						<dt className="mt-1 text-xs leading-snug text-text-secondary">{metric.label}</dt>
						<dd className="text-xl font-bold text-accent-primary">{metric.value}</dd>
					</div>
				))}
			</dl>

			<ul className="relative flex flex-wrap content-start gap-2" aria-label={t('stackLabel')}>
				{project.stack.map((tech) => (
					<li
						key={tech}
						className="rounded-lg bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary border border-border"
					>
						{tech}
					</li>
				))}
			</ul>

			<div className="relative flex flex-col gap-3 self-end">
				<LinkButton href={caseStudyHref} external={false} icon={<ArrowRight className="w-4 h-4" />} className="w-full">
					{t('viewCaseStudy')}
				</LinkButton>
				{secondaryActions.length > 0 && (
					<div className={cn('grid gap-3', secondaryActions.length > 1 && 'grid-cols-2')}>
						{secondaryActions.map((action) => (
							<LinkButton
								key={action.href}
								href={action.href}
								external={action.external}
								variant="secondary"
								icon={action.icon}
								className="w-full"
							>
								{action.label}
							</LinkButton>
						))}
					</div>
				)}
			</div>
		</motion.article>
	);
}
