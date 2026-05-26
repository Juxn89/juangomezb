'use client';

import {useTranslations, useLocale} from 'next-intl';
import {motion} from 'framer-motion';
import {Mail} from 'lucide-react';
import {TypeAnimation} from 'react-type-animation';
import Image from 'next/image';
import {cn} from '@/lib/utils/cn';

export function HeroSection() {
	const t = useTranslations('hero');
	const locale = useLocale();

	// Get roles array from translations
	const roles = t.raw('roles') as string[];

	// Build typewriter sequence: [role1, 2000, role2, 2000, ...]
	const typeSequence = roles.flatMap((role) => [role, 2000]);

	// Animation variants
	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: {opacity: 0, y: 30},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1] as const,
			},
		},
	};

	const floatAnimation = {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: 'easeInOut' as const,
		},
	};

	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
		e.preventDefault();
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({behavior: 'smooth'});
		}
	};

	// Custom SVG Icons (lucide-react doesn't have Github/Linkedin)
	const GitHubIcon = () => (
		<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
			<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
		</svg>
	);

	const LinkedInIcon = () => (
		<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);

	// Social links
	const socialLinks = [
		{
			name: 'GitHub',
			url: 'https://github.com/juxn89',
			icon: GitHubIcon,
			label: 'GitHub Profile',
		},
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/jcgomez89/',
			icon: LinkedInIcon,
			label: 'LinkedIn Profile',
		},
		{
			name: 'Email',
			url: 'mailto:gb.jc@outlook.com',
			icon: Mail,
			label: 'Send Email',
		},
	];

	return (
		<section
			id="home"
			className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20 md:py-32"
		>
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
						transition: {duration: 8, repeat: Infinity, ease: 'easeInOut' as const},
					}}
					className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-secondary/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						y: [-15, 15, -15],
						transition: {duration: 7, repeat: Infinity, ease: 'easeInOut' as const},
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-tertiary/10 rounded-full blur-3xl"
				/>
			</div>

			{/* Main Content */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 max-w-6xl mx-auto w-full"
			>
				{/* Two-column layout: Photo left, Info right */}
				<div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
					{/* Profile Photo */}
					<motion.div
						variants={itemVariants}
						className="relative w-48 h-48 md:w-64 md:h-64 shrink-0"
					>
						<div className="relative w-full h-full">
							<Image
								src="/images/profile_photo.png"
								alt={t('name')}
								fill
								priority
								className={cn(
									'rounded-full object-cover',
									'border-4 border-accent-primary/20',
									'shadow-2xl shadow-accent-primary/20',
									'transition-transform duration-300',
									'hover:scale-105 hover:border-accent-primary/40'
								)}
								sizes="(max-width: 768px) 192px, 256px"
							/>
						</div>
					</motion.div>

					{/* Info Column */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
						{/* Greeting Badge */}
						<motion.div variants={itemVariants} className="mb-4">
							<span className="inline-block px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-sm font-medium text-text-primary">
								{t('greeting')}
							</span>
						</motion.div>

						{/* Name */}
						<motion.h1
							variants={itemVariants}
							className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 pb-1 leading-tight"
						>
							<span className="gradient-text">{t('name')}</span>
						</motion.h1>

						{/* Animated Roles (Typewriter Effect) */}
						<motion.div variants={itemVariants} className="mb-6 h-12 md:h-14">
							<TypeAnimation
								sequence={typeSequence}
								wrapper="h2"
								speed={50}
								className="text-2xl sm:text-3xl md:text-4xl font-semibold text-accent-primary"
								repeat={Infinity}
							/>
						</motion.div>

						{/* Description */}
						<motion.p
							variants={itemVariants}
							className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-8"
						>
							{t('description')}
						</motion.p>

						{/* Social Links */}
						<motion.div
							variants={itemVariants}
							className="flex items-center justify-center md:justify-start gap-4"
						>
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.url}
										target={social.url.startsWith('mailto:') ? undefined : '_blank'}
										rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
										aria-label={social.label}
										whileHover={{scale: 1.1, y: -2}}
										whileTap={{scale: 0.95}}
										className={cn(
											'p-3 rounded-full',
											'bg-bg-secondary border-2 border-border',
											'text-text-primary',
											'hover:border-accent-primary hover:bg-accent-primary/10',
											'transition-all duration-300',
											'shadow-lg hover:shadow-accent-primary/20'
										)}
									>
										<Icon className="w-5 h-5" />
									</motion.a>
								);
							})}
						</motion.div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{opacity: 0, y: -20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 1.5, duration: 0.6}}
					className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
				>
					<a href="#about" onClick={(e) => handleScroll(e, 'about')} aria-label="Scroll to About section">
						<motion.div
							animate={{y: [0, 10, 0]}}
							transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
							className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex items-start justify-center p-2 cursor-pointer hover:border-accent-primary transition-colors"
						>
							<motion.div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full" />
						</motion.div>
					</a>
				</motion.div>
			</motion.div>
		</section>
	);
}
