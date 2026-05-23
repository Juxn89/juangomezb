'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {FolderGit2} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

export function ProjectsSection() {
	const t = useTranslations('projects');

	return (
		<section id="projects" className="min-h-screen py-20 px-4 bg-bg-secondary">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{opacity: 0, y: 20}}
					whileInView={{opacity: 1, y: 0}}
					viewport={{once: true, amount: 0.1}}
					transition={{duration: 0.6}}
				>
					{/* Header */}
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4">
							{t('title')}
						</h2>
						<p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
							{t('subtitle')}
						</p>
					</div>

					{/* Placeholder Content */}
					<div className="flex flex-col items-center justify-center py-20">
						<motion.div
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						>
							<FolderGit2 className="w-24 h-24 text-accent-primary mb-6" />
						</motion.div>
						<p className="text-text-secondary text-lg">
							{t('comingSoon')}
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
