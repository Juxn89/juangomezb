'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Mail, MapPin, Send, Briefcase} from 'lucide-react';

export function ContactSection() {
	const t = useTranslations('contact');

	return (
		<section id="contact" className="relative py-20 overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-tertiary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<motion.div
					initial={{opacity: 0, y: 20}}
					whileInView={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
					viewport={{once: true}}
					className="mb-16 text-center"
				>
					<h2 className="text-4xl font-bold gradient-text mb-4 pb-1 leading-tight">
						{t('title')}
					</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">
						{t('subtitle')}
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Contact Info Cards */}
					<div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
						{/* Email Card */}
						<motion.div
							initial={{opacity: 0, x: -20}}
							whileInView={{opacity: 1, x: 0}}
							transition={{duration: 0.5, delay: 0.1}}
							viewport={{once: true}}
							whileHover={{scale: 1.02}}
							className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent-primary/50 transition-all duration-300"
						>
							<Mail className="w-8 h-8 text-accent-primary mb-4" />
							<h3 className="text-lg font-bold text-text-primary mb-2">
								{t('info.email')}
							</h3>
							<a
								href={`mailto:${t('info.emailValue')}`}
								className="text-text-secondary hover:text-accent-primary transition-colors break-all"
							>
								{t('info.emailValue')}
							</a>
						</motion.div>

						{/* Location Card */}
						<motion.div
							initial={{opacity: 0, x: -20}}
							whileInView={{opacity: 1, x: 0}}
							transition={{duration: 0.5, delay: 0.2}}
							viewport={{once: true}}
							whileHover={{scale: 1.02}}
							className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent-secondary/50 transition-all duration-300"
						>
							<MapPin className="w-8 h-8 text-accent-secondary mb-4" />
							<h3 className="text-lg font-bold text-text-primary mb-2">
								{t('info.location')}
							</h3>
							<p className="text-text-secondary">
								{t('info.locationValue')}
							</p>
						</motion.div>

						{/* Availability Card */}
						<motion.div
							initial={{opacity: 0, x: -20}}
							whileInView={{opacity: 1, x: 0}}
							transition={{duration: 0.5, delay: 0.3}}
							viewport={{once: true}}
							whileHover={{scale: 1.02}}
							className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent-tertiary/50 transition-all duration-300"
						>
							<Briefcase className="w-8 h-8 text-accent-tertiary mb-4" />
							<h3 className="text-lg font-bold text-text-primary mb-2">
								{t('info.availability')}
							</h3>
							<p className="text-text-secondary">
								{t('info.availabilityValue')}
							</p>
						</motion.div>
					</div>

					{/* Contact Form Placeholder - TODO: Implement email backend (Resend/SendGrid) */}
					<div className="lg:col-span-3">
						<motion.div
							initial={{opacity: 0, y: 20}}
							whileInView={{opacity: 1, y: 0}}
							transition={{duration: 0.5, delay: 0.4}}
							viewport={{once: true}}
							className="p-12 rounded-2xl bg-bg-secondary border border-border text-center"
						>
							<Send className="w-12 h-12 text-accent-primary mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-text-primary mb-4">
								{t('form.title')}
							</h3>
							<p className="text-text-secondary mb-6 max-w-md mx-auto">
								Contact form coming soon. For now, please reach out via email directly.
							</p>
							<a
								href={`mailto:${t('info.emailValue')}`}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-primary text-white font-bold hover:shadow-xl hover:shadow-accent-primary/40 transition-all duration-300"
							>
								<Mail className="w-5 h-5" />
								Send Email
							</a>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
