'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase, MapPin, Calendar, CheckCircle2} from 'lucide-react';
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

export function ExperienceSection() {
	const t = useTranslations('experience');

	// Get jobs from translations
	const jobsData = t.raw('jobs') as Job[];

	return (
		<section id="experience" className="min-h-screen py-20 px-4 bg-bg-secondary">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<motion.div
					className="mb-16 text-center"
					initial={{opacity: 0, y: 20}}
					whileInView={{opacity: 1, y: 0}}
					viewport={{once: true}}
					transition={{duration: 0.5}}
				>
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent1/10 px-4 py-2">
						<motion.div
							animate={{
								rotate: [0, 10, -10, 10, 0],
								scale: [1, 1.1, 1, 1.1, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatDelay: 3,
							}}
						>
							<Briefcase className="h-5 w-5 text-accent1" />
						</motion.div>
						<span className="text-sm font-medium text-accent1">
							{t('subtitle')}
						</span>
					</div>
					<h2 className="text-4xl font-bold gradient-text md:text-5xl pb-1 leading-tight">
						{t('title')}
					</h2>
				</motion.div>

				{/* Timeline */}
				<div className="relative">
					{/* Vertical line - hidden on mobile, shown on md+ */}
					<div className="absolute left-8 top-0 hidden h-full w-0.5 bg-linear-to-b from-accent1 via-accent2 to-accent3 md:block" />

					{/* Jobs */}
				<div className="space-y-8">
						{jobsData.map((job, index) => (
							<motion.div
								key={job.id}
								initial={{opacity: 0, x: -50}}
								whileInView={{opacity: 1, x: 0}}
								viewport={{once: true}}
								transition={{duration: 0.5, delay: index * 0.1}}
								className="relative"
							>
								{/* Timeline dot */}
								<div className="absolute left-8 top-6 hidden h-4 w-4 -translate-x-1/2 md:block">
									<motion.div
										className={cn(
											'h-full w-full rounded-full border-4 border-bg-secondary',
											index === 0
												? 'bg-accent1 shadow-lg shadow-accent1/50'
												: 'bg-accent2',
										)}
										initial={{scale: 0}}
										whileInView={{scale: 1}}
										viewport={{once: true}}
										transition={{
											duration: 0.3,
											delay: index * 0.1 + 0.2,
										}}
									/>
									{index === 0 && (
										<motion.div
											className="absolute inset-0 rounded-full bg-accent1"
											animate={{
												scale: [1, 1.5, 1],
												opacity: [0.5, 0, 0.5],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
											}}
										/>
									)}
								</div>

								{/* Job card */}
								<div className="ml-0 md:ml-20">
									<motion.div
									className="group relative overflow-hidden rounded-2xl border border-border bg-bg-primary p-5 shadow-lg transition-all hover:shadow-xl hover:shadow-accent1/10"
										whileHover={{y: -4}}
										transition={{duration: 0.2}}
									>
										{/* Gradient border on hover */}
										<div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
											<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent1/20 via-accent2/20 to-accent3/20 blur-xl" />
										</div>

										{/* Header */}
										<div className="mb-3">
										<div className="mb-2 flex flex-wrap items-start justify-between gap-3">
											<div>
												<h3 className="text-xl font-bold text-text-primary md:text-2xl">
													{job.position}
												</h3>
												<p className="text-lg font-semibold text-accent1 md:text-xl">
													{job.company}
												</p>
											</div>
											{index === 0 && (
												<motion.span
											className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary px-3 py-1 text-sm font-bold text-white shadow-lg shadow-accent-primary/30 ring-2 ring-accent-primary/20"
													animate={{
														scale: [1, 1.05, 1],
													}}
													transition={{
														duration: 2,
														repeat: Infinity,
													}}
												>
													{t('present')}
												</motion.span>
											)}
											</div>

										<div className="flex flex-wrap gap-3 text-sm text-text-secondary">
											<div className="flex items-center gap-1.5">
												<Calendar className="h-4 w-4" />
												<span>{job.period}</span>
											</div>
											<div className="flex items-center gap-1.5">
												<MapPin className="h-4 w-4" />
												<span>{job.location}</span>
											</div>
										</div>
									</div>

									{/* Description */}
									<p className="mb-3 text-sm text-text-secondary">
										{job.description}
									</p>

									{/* Achievements */}
									<div className="mb-3">
										<ul className="space-y-1.5">
												{job.achievements.map((achievement, i) => (
													<motion.li
														key={i}
														className="flex gap-2 text-sm text-text-secondary"
														initial={{opacity: 0, x: -20}}
														whileInView={{opacity: 1, x: 0}}
														viewport={{once: true}}
														transition={{
															duration: 0.3,
															delay: index * 0.1 + i * 0.05,
														}}
													>
														<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent2" />
														<span>{achievement}</span>
													</motion.li>
												))}
											</ul>
										</div>

										{/* Technologies */}
										<div className="flex flex-wrap gap-2">
											{job.technologies.map((tech, i) => (
												<motion.span
													key={i}
										className="rounded-full bg-accent-secondary px-3 py-1 text-xs font-bold text-slate-900 shadow-md transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-secondary/30 dark:text-white"
													initial={{opacity: 0, scale: 0.8}}
													whileInView={{opacity: 1, scale: 1}}
													viewport={{once: true}}
													transition={{
														duration: 0.2,
														delay: index * 0.1 + i * 0.03,
													}}
													whileHover={{scale: 1.05}}
												>
													{tech}
												</motion.span>
											))}
										</div>
									</motion.div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Bottom CTA */}
				<motion.div
					className="mt-16 text-center"
					initial={{opacity: 0}}
					whileInView={{opacity: 1}}
					viewport={{once: true}}
					transition={{duration: 0.5, delay: 0.3}}
				>
					<p className="text-text-secondary">
						Want to know more about my work?{' '}
						<a
							href="#contact"
							className="font-semibold text-accent1 transition-colors hover:text-accent1/80"
							onClick={(e) => {
								e.preventDefault();
								document
									.getElementById('contact')
									?.scrollIntoView({behavior: 'smooth'});
							}}
						>
							Let's connect →
						</a>
					</p>
				</motion.div>
			</div>
		</section>
	);
}
