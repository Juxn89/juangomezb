'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Link} from '@/routing';
import {ArrowRight, Mail} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

export default function Home() {
	const t = useTranslations('hero');

	// Animation variants
	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: {opacity: 0, y: 20},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1],
			},
		},
	};

	const floatAnimation = {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: 'easeInOut',
		},
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 -z-10">
				{/* Gradient Orbs */}
				<motion.div
					animate={floatAnimation}
					className="absolute top-20 -left-20 w-72 h-72 bg-accent-primary/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						y: [10, -10, 10],
						transition: {duration: 8, repeat: Infinity, ease: 'easeInOut'},
					}}
					className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-secondary/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						y: [-15, 15, -15],
						transition: {duration: 7, repeat: Infinity, ease: 'easeInOut'},
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-tertiary/10 rounded-full blur-3xl"
				/>
			</div>

			{/* Main Content */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 max-w-5xl mx-auto text-center"
			>
				{/* Greeting */}
				<motion.div variants={itemVariants} className="mb-4">
					<span className="inline-block px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-sm font-medium text-accent-primary">
						{t('greeting')}
					</span>
				</motion.div>

				{/* Name */}
				<motion.h1
					variants={itemVariants}
					className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
				>
					<span className="gradient-text">{t('name')}</span>
				</motion.h1>

				{/* Title */}
				<motion.h2
					variants={itemVariants}
					className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary mb-6"
				>
					{t('title')}
				</motion.h2>

				{/* Description */}
				<motion.p
					variants={itemVariants}
					className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12"
				>
					{t('description')}
				</motion.p>

				{/* CTA Buttons */}
				<motion.div
					variants={itemVariants}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<Link href="/projects">
						<motion.button
							whileHover={{scale: 1.05}}
							whileTap={{scale: 0.95}}
							className={cn(
								'group px-8 py-4 rounded-lg',
								'bg-accent-primary text-white font-semibold',
								'hover:bg-accent-primary/90',
								'shadow-lg shadow-accent-primary/25',
								'transition-all duration-300',
								'flex items-center gap-2',
								'w-full sm:w-auto justify-center'
							)}
						>
							{t('cta.primary')}
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</motion.button>
					</Link>

					<Link href="/contact">
						<motion.button
							whileHover={{scale: 1.05}}
							whileTap={{scale: 0.95}}
							className={cn(
								'group px-8 py-4 rounded-lg',
								'bg-bg-secondary border-2 border-border',
								'text-text-primary font-semibold',
								'hover:border-accent-secondary hover:bg-accent-secondary/10',
								'transition-all duration-300',
								'flex items-center gap-2',
								'w-full sm:w-auto justify-center'
							)}
						>
							<Mail className="w-5 h-5" />
							{t('cta.secondary')}
						</motion.button>
					</Link>
				</motion.div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{opacity: 0, y: -20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 1.5, duration: 0.6}}
					className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
				>
					<motion.div
						animate={{y: [0, 10, 0]}}
						transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
						className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex items-start justify-center p-2"
					>
						<motion.div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full" />
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	);
}
