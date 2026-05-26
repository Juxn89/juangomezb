'use client';

import {useTranslations, useLocale} from 'next-intl';
import {motion} from 'framer-motion';
import {Download, Code, Database, Cloud, Layers, GitBranch, Zap} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

export function AboutSection() {
	const t = useTranslations('about');
	const locale = useLocale();

	const skills = [
		// Frontend
		{name: 'React', category: 'frontend', icon: Code},
		{name: 'Next.js', category: 'frontend', icon: Code},
		{name: 'TypeScript', category: 'frontend', icon: Code},
		{name: 'JavaScript', category: 'frontend', icon: Code},
		{name: 'Angular', category: 'frontend', icon: Code},
		{name: 'HTML/CSS', category: 'frontend', icon: Code},
		{name: 'Tailwind CSS', category: 'frontend', icon: Code},
		// Backend
		{name: '.NET', category: 'backend', icon: Database},
		{name: 'Node.js', category: 'backend', icon: Database},
		{name: 'C#', category: 'backend', icon: Database},
		{name: 'SQL Server', category: 'backend', icon: Database},
		{name: 'PostgreSQL', category: 'backend', icon: Database},
		{name: 'REST APIs', category: 'backend', icon: Database},
		// Cloud & DevOps
		{name: 'AWS', category: 'cloud', icon: Cloud},
		{name: 'Azure', category: 'cloud', icon: Cloud},
		{name: 'Docker', category: 'cloud', icon: Cloud},
		{name: 'CI/CD', category: 'devops', icon: GitBranch},
		{name: 'Git', category: 'devops', icon: GitBranch},
		{name: 'TFS', category: 'devops', icon: GitBranch},
		// Architecture
		{name: 'Microservices', category: 'architecture', icon: Layers},
		{name: 'Microfrontends', category: 'architecture', icon: Layers},
		{name: 'Agile/Scrum', category: 'architecture', icon: Zap},
	];

	const stats = [
		{label: t('stats.years'), value: '15+'},
		{label: t('stats.companies'), value: '6'},
		{label: t('stats.reach'), value: '153'},
		{label: t('stats.scope'), value: '8+'},
	];

	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: {opacity: 0, y: 20},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: [0.22, 1, 0.36, 1] as const,
			},
		},
	};

	const cvUrl = locale === 'es' 
		? '/resume/juan-gomez-cv-es.pdf'
		: '/resume/juan-gomez-cv-en.pdf';

	return (
		<section id="about" className="min-h-screen py-20 px-4 bg-bg-primary">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{once: true, amount: 0.1}}
				>
					{/* Header */}
					<motion.div variants={itemVariants} className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4 pb-1 leading-tight">
							{t('title')}
						</h2>
						<p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
							{t('subtitle')}
						</p>
					</motion.div>

					{/* Stats Grid */}
					<motion.div
						variants={itemVariants}
						className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
					>
						{stats.map((stat) => (
							<motion.div
								key={stat.label}
								whileHover={{scale: 1.05}}
								className={cn(
									'p-6 rounded-lg',
									'bg-bg-secondary border border-border',
									'text-center',
									'hover:border-accent-primary/50',
									'transition-colors duration-300'
								)}
							>
								<div className="text-3xl md:text-4xl font-bold gradient-text mb-2 pb-1 leading-tight">
									{stat.value}
								</div>
								<div className="text-sm text-text-secondary">
									{stat.label}
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Bio Section */}
					<motion.div
						variants={itemVariants}
						className={cn(
							'p-8 rounded-2xl mb-16',
							'bg-linear-to-br from-bg-secondary to-bg-primary',
							'border border-border',
							'shadow-lg'
						)}
					>
						<h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
							{t('bioTitle')}
						</h3>
						<p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
							{t('bio')}
						</p>
						
						{/* Download CV Button */}
						<motion.a
							href={cvUrl}
							download
							whileHover={{scale: 1.05}}
							whileTap={{scale: 0.95}}
							className={cn(
								'inline-flex items-center gap-2',
								'px-6 py-3 rounded-lg',
								'bg-accent-primary text-white font-semibold',
								'hover:bg-accent-primary/90',
								'shadow-lg shadow-accent-primary/25',
								'transition-all duration-300'
							)}
						>
							<Download className="w-5 h-5" />
							{t('downloadCV')}
						</motion.a>
					</motion.div>

					{/* Skills Cloud */}
					<motion.div variants={itemVariants} className="mb-16">
						<h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
							{t('skillsTitle')}
						</h3>
						
						<div className="flex flex-wrap gap-3 justify-center">
							{skills.map((skill, index) => {
								const Icon = skill.icon;
								return (
									<motion.div
										key={skill.name}
										initial={{opacity: 0, scale: 0.8}}
										whileInView={{opacity: 1, scale: 1}}
										viewport={{once: true}}
										transition={{
											delay: index * 0.03,
											duration: 0.4,
										ease: [0.22, 1, 0.36, 1] as const,
										}}
										whileHover={{scale: 1.1, y: -2}}
										className={cn(
											'px-4 py-2 rounded-full',
											'bg-bg-secondary border-2 border-border',
											'text-text-primary font-medium text-sm',
											'hover:border-accent-primary hover:bg-accent-primary/10',
											'transition-all duration-300',
											'cursor-default',
											'flex items-center gap-2'
										)}
									>
										<Icon className="w-4 h-4 text-accent-primary" />
										{skill.name}
									</motion.div>
								);
							})}
						</div>
					</motion.div>

					{/* Expertise Areas */}
					<motion.div variants={itemVariants}>
						<h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
							{t('expertiseTitle')}
						</h3>
						
						<div className="grid md:grid-cols-3 gap-6">
							{/* Frontend */}
							<motion.div
								whileHover={{y: -5}}
								className={cn(
									'p-6 rounded-xl',
									'bg-bg-secondary border border-border',
									'hover:border-accent-primary/50',
									'transition-all duration-300'
								)}
							>
								<Code className="w-10 h-10 text-accent-primary mb-4" />
								<h4 className="text-xl font-bold text-text-primary mb-3">
									Frontend
								</h4>
								<p className="text-text-secondary text-sm">
									{t('expertise.frontend')}
								</p>
							</motion.div>

							{/* Backend */}
							<motion.div
								whileHover={{y: -5}}
								className={cn(
									'p-6 rounded-xl',
									'bg-bg-secondary border border-border',
									'hover:border-accent-secondary/50',
									'transition-all duration-300'
								)}
							>
								<Database className="w-10 h-10 text-accent-secondary mb-4" />
								<h4 className="text-xl font-bold text-text-primary mb-3">
									Backend
								</h4>
								<p className="text-text-secondary text-sm">
									{t('expertise.backend')}
								</p>
							</motion.div>

							{/* Cloud & DevOps */}
							<motion.div
								whileHover={{y: -5}}
								className={cn(
									'p-6 rounded-xl',
									'bg-bg-secondary border border-border',
									'hover:border-accent-tertiary/50',
									'transition-all duration-300'
								)}
							>
								<Cloud className="w-10 h-10 text-accent-tertiary mb-4" />
								<h4 className="text-xl font-bold text-text-primary mb-3">
									Cloud & DevOps
								</h4>
								<p className="text-text-secondary text-sm">
									{t('expertise.cloud')}
								</p>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
