'use client';

import {motion} from 'framer-motion';
import {ExternalLink, Sparkles, CheckCircle2} from 'lucide-react';
import {LinkButton} from '@/components/ui/LinkButton';

// Custom GitHub Icon
const GithubIcon = ({className}: {className?: string}) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
		aria-hidden="true"
	>
		<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
	</svg>
);

interface ProjectCardProps {
	project: {
		id: string;
		title: string;
		description: string;
		technologies: string[];
		highlights: string[];
		demoUrl: string;
		codeUrl?: string;
		featured: boolean;
	};
	index: number;
	viewDemoText: string;
	viewCodeText: string;
}

export function ProjectCard({project, index, viewDemoText, viewCodeText}: ProjectCardProps) {
	return (
		<motion.article
			initial={{opacity: 0, y: 30}}
			whileInView={{opacity: 1, y: 0}}
			transition={{duration: 0.5, delay: index * 0.1}}
			viewport={{once: true}}
			className="group relative"
		>
			{/* Featured Badge */}
			{project.featured && (
				<motion.div
					initial={{opacity: 0, x: -20}}
					whileInView={{opacity: 1, x: 0}}
					transition={{duration: 0.5, delay: index * 0.1 + 0.2}}
					viewport={{once: true}}
					className="absolute -top-3 -left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-accent-tertiary px-3 py-1 text-xs font-bold text-white shadow-lg shadow-accent-tertiary/30"
				>
					<Sparkles className="w-3 h-3" />
					Featured
				</motion.div>
			)}

			{/* Project Card */}
			<div className="relative h-full rounded-2xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/10 hover:-translate-y-1">
				{/* Gradient overlay on hover */}
				<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<div className="relative z-10 flex flex-col h-full">
					{/* Project Header */}
					<div className="mb-4">
						<h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
							{project.title}
						</h3>
						<p className="text-text-secondary leading-relaxed">{project.description}</p>
					</div>

					{/* Highlights */}
					{project.highlights.length > 0 && (
						<div className="mb-6 space-y-2">
							{project.highlights.map((highlight, i) => (
								<motion.div
									key={i}
									initial={{opacity: 0, x: -10}}
									whileInView={{opacity: 1, x: 0}}
									transition={{duration: 0.3, delay: index * 0.1 + i * 0.1}}
									viewport={{once: true}}
									className="flex items-start gap-2"
								>
										<CheckCircle2 className="w-4 h-4 text-accent-secondary mt-0.5 shrink-0" />
									<span className="text-sm text-text-secondary">{highlight}</span>
								</motion.div>
							))}
						</div>
					)}

					{/* Technologies */}
					{project.technologies.length > 0 && (
						<div className="mb-6">
							<div className="flex flex-wrap gap-2">
								{project.technologies.map((tech, i) => (
									<motion.span
										key={i}
										initial={{opacity: 0, scale: 0.8}}
										whileInView={{opacity: 1, scale: 1}}
										transition={{duration: 0.3, delay: index * 0.1 + i * 0.05}}
										viewport={{once: true}}
										className="rounded-lg bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary border border-border transition-all hover:border-accent-primary hover:text-accent-primary hover:scale-105"
									>
										{tech}
									</motion.span>
								))}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-wrap gap-3 mt-auto">
						<LinkButton
							href={project.demoUrl}
							variant="primary"
							icon={<ExternalLink className="w-4 h-4" />}
						>
							{viewDemoText}
						</LinkButton>
						
						{project.codeUrl && (
							<LinkButton
								href={project.codeUrl}
								variant="secondary"
								icon={<GithubIcon className="w-4 h-4" />}
							>
								{viewCodeText}
							</LinkButton>
						)}
					</div>
				</div>
			</div>
		</motion.article>
	);
}
