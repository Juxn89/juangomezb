'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase, MapPin, Calendar, CheckCircle2, ChevronDown} from 'lucide-react';
import {CONTACT_EMAIL} from '@/lib/constants/site';
import {cn} from '@/lib/utils/cn';

interface Job {
	id: number;
	company: string;
	position: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
	technologies: string[];
}

// A recruiter skims the latest roles first: those show their strongest achievements (the messages list
// them strongest first), older roles show only their summary. Everything else is one click away.
const RECENT_ROLES = 2;
const VISIBLE_ACHIEVEMENTS = 2;

export function ExperienceSection() {
	const t = useTranslations('experience');
	const jobs = t.raw('jobs') as Job[];

	return (
		<section id="experience" className="py-16 md:py-20 px-4 bg-bg-secondary">
			<div className="mx-auto max-w-6xl">
				<motion.div
					className="mb-12 text-center"
					initial={{opacity: 0, y: 20}}
					whileInView={{opacity: 1, y: 0}}
					viewport={{once: true}}
					transition={{duration: 0.5}}
				>
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-4 py-2">
						<Briefcase className="h-5 w-5 text-accent-primary" aria-hidden="true" />
						<span className="text-sm font-medium text-accent-primary">{t('subtitle')}</span>
					</div>
					<h2 className="text-4xl font-bold gradient-text md:text-5xl pb-1 leading-tight">{t('title')}</h2>
				</motion.div>

				<div className="relative">
					{/* Timeline line, md+ only */}
					<div
						className="absolute left-8 top-0 hidden h-full w-0.5 bg-linear-to-b from-accent-primary via-accent-secondary to-accent-tertiary/40 md:block"
						aria-hidden="true"
					/>

					<ol className="space-y-5">
						{jobs.map((job, index) => (
							<JobItem
								key={job.id}
								job={job}
								index={index}
								visibleAchievements={index < RECENT_ROLES ? VISIBLE_ACHIEVEMENTS : 0}
							/>
						))}
					</ol>
				</div>

				<motion.div
					className="mt-16 text-center"
					initial={{opacity: 0}}
					whileInView={{opacity: 1}}
					viewport={{once: true}}
					transition={{duration: 0.5, delay: 0.3}}
				>
					<p className="text-text-secondary">
						{t('cta.question')}{' '}
						<a
							href={`mailto:${CONTACT_EMAIL}`}
							className="font-semibold text-accent-primary transition-colors hover:underline"
						>
							{t('cta.action')} →
						</a>
					</p>
				</motion.div>
			</div>
		</section>
	);
}

function JobItem({job, index, visibleAchievements}: {job: Job; index: number; visibleAchievements: number}) {
	const t = useTranslations('experience');
	const [expanded, setExpanded] = useState(false);
	const moreId = useId();
	const moreRef = useRef<HTMLUListElement>(null);
	const isCurrent = index === 0;

	const visible = job.achievements.slice(0, visibleAchievements);
	const more = job.achievements.slice(visibleAchievements);

	// The collapsed achievements stay in the server HTML, so search engines index them. React renders
	// hidden="until-found" as a plain hidden="", so the value is set here instead: find-in-page can then
	// reach the text, and the browser fires beforematch to expand the card.
	useEffect(() => {
		const list = moreRef.current;
		if (!list) return;
		if (!expanded) list.setAttribute('hidden', 'until-found');
		const expand = () => setExpanded(true);
		list.addEventListener('beforematch', expand);
		return () => list.removeEventListener('beforematch', expand);
	}, [expanded]);

	return (
		<motion.li
			initial={{opacity: 0, x: -30}}
			whileInView={{opacity: 1, x: 0}}
			viewport={{once: true}}
			transition={{duration: 0.4, delay: Math.min(index, 3) * 0.08}}
			className="relative"
		>
			{/* Timeline dot */}
			<div className="absolute left-8 top-6 hidden h-4 w-4 -translate-x-1/2 md:block" aria-hidden="true">
				{isCurrent && (
					<span className="absolute inset-0 rounded-full bg-accent-primary opacity-60 motion-safe:animate-ping" />
				)}
				<span
					className={cn(
						'relative block h-full w-full rounded-full border-4 border-bg-secondary',
						isCurrent ? 'bg-accent-primary' : 'bg-accent-secondary'
					)}
				/>
			</div>

			<article className="md:ml-20 rounded-2xl border border-border bg-bg-primary p-5 shadow-lg transition-shadow hover:shadow-xl hover:shadow-accent-primary/10">
				{/* Role on the left, when and where on the right: one band instead of three stacked lines. */}
				<header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
					<div>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
							<h3 className="text-xl font-bold text-text-primary">{job.position}</h3>
							{isCurrent && (
								<span className="inline-flex items-center rounded-full bg-accent-primary px-2.5 py-0.5 text-xs font-bold text-white">
									{t('present')}
								</span>
							)}
						</div>
						<p className="font-semibold text-accent-primary">{job.company}</p>
					</div>
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary sm:shrink-0 sm:flex-col sm:items-end">
						<span className="flex items-center gap-1.5">
							<Calendar className="h-4 w-4" aria-hidden="true" />
							{job.period}
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin className="h-4 w-4" aria-hidden="true" />
							{job.location}
						</span>
					</div>
				</header>

				<p className="mb-3 text-sm leading-relaxed text-text-secondary">{job.description}</p>

				{visible.length > 0 && <AchievementList items={visible} className="mb-3" />}
				{more.length > 0 && (
					<AchievementList ref={moreRef} id={moreId} items={more} hidden={!expanded} className="mb-3" />
				)}

				{/* Technologies and the toggle share one row. */}
				<div className="flex flex-wrap items-center justify-between gap-3">
					<ul className="flex flex-wrap gap-2" aria-label={t('technologiesLabel')}>
						{job.technologies.map((tech) => (
							<li
								key={tech}
								className="rounded-lg border border-border bg-bg-secondary px-3 py-1 text-xs font-medium text-text-secondary"
							>
								{tech}
							</li>
						))}
					</ul>
					{more.length > 0 && (
						<button
							type="button"
							onClick={() => setExpanded((open) => !open)}
							aria-expanded={expanded}
							aria-controls={moreId}
							className="inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm font-semibold text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
						>
							{expanded
								? t('showLess')
								: visible.length > 0
									? t('showMore', {count: more.length})
									: t('showAchievements', {count: more.length})}
							<ChevronDown
								className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
								aria-hidden="true"
							/>
						</button>
					)}
				</div>
			</article>
		</motion.li>
	);
}

function AchievementList({
	items,
	ref,
	...props
}: {items: string[]; ref?: React.Ref<HTMLUListElement>} & React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul ref={ref} {...props} className={cn('space-y-1.5', props.className)}>
			{items.map((achievement) => (
				<li key={achievement} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
					<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-secondary" aria-hidden="true" />
					<span>{achievement}</span>
				</li>
			))}
		</ul>
	);
}
