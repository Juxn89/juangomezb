'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Mail, MapPin, Send} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

export function ContactSection() {
	const t = useTranslations('contact');

	return (
		<section id="contact" className="min-h-screen py-20 px-4 bg-bg-primary">
			<div className="container mx-auto max-w-4xl">
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

					{/* Contact Info Cards */}
					<div className="grid md:grid-cols-2 gap-6 mb-12">
						{/* Email */}
						<motion.div
							whileHover={{scale: 1.02}}
							className={cn(
								'p-6 rounded-xl',
								'bg-bg-secondary border border-border',
								'hover:border-accent-primary/50',
								'transition-all duration-300'
							)}
						>
							<Mail className="w-8 h-8 text-accent-primary mb-4" />
							<h3 className="text-lg font-bold text-text-primary mb-2">
								Email
							</h3>
							<p className="text-text-secondary">
								contact@juangomez.dev
							</p>
						</motion.div>

						{/* Location */}
						<motion.div
							whileHover={{scale: 1.02}}
							className={cn(
								'p-6 rounded-xl',
								'bg-bg-secondary border border-border',
								'hover:border-accent-secondary/50',
								'transition-all duration-300'
							)}
						>
							<MapPin className="w-8 h-8 text-accent-secondary mb-4" />
							<h3 className="text-lg font-bold text-text-primary mb-2">
								{t('location')}
							</h3>
							<p className="text-text-secondary">
								Managua, Nicaragua
							</p>
						</motion.div>
					</div>

					{/* Placeholder for Contact Form */}
					<motion.div
						whileHover={{scale: 1.01}}
						className={cn(
							'p-8 rounded-2xl',
							'bg-gradient-to-br from-bg-secondary to-bg-primary',
							'border border-border',
							'shadow-lg',
							'text-center'
						)}
					>
						<Send className="w-16 h-16 text-accent-tertiary mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-text-primary mb-2">
							{t('formTitle')}
						</h3>
						<p className="text-text-secondary">
							{t('formComingSoon')}
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
