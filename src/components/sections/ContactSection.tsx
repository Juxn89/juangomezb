'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Mail, MapPin, Send, CheckCircle2, AlertCircle, Briefcase} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export function ContactSection() {
	const t = useTranslations('contact');
	const [formState, setFormState] = useState<FormState>('idle');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: ''
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = t('validation.nameRequired');
		} else if (formData.name.trim().length < 2) {
			newErrors.name = t('validation.nameMin');
		}

		if (!formData.email.trim()) {
			newErrors.email = t('validation.emailRequired');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = t('validation.emailInvalid');
		}

		if (!formData.message.trim()) {
			newErrors.message = t('validation.messageRequired');
		} else if (formData.message.trim().length < 10) {
			newErrors.message = t('validation.messageMin');
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setFormState('sending');

		// Simulate API call (replace with actual Server Action)
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			
			// Here you would call your Server Action
			// const result = await submitContactForm(formData);
			
			setFormState('success');
			setFormData({name: '', email: '', message: ''});
			setErrors({});

			// Reset success message after 5 seconds
			setTimeout(() => {
				setFormState('idle');
			}, 5000);
		} catch (error) {
			setFormState('error');
			// Reset error message after 5 seconds
			setTimeout(() => {
				setFormState('idle');
			}, 5000);
		}
	};

	const handleChange = (field: keyof typeof formData) => (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({...prev, [field]: e.target.value}));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = {...prev};
				delete newErrors[field];
				return newErrors;
			});
		}
	};

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
					<h2 className="text-4xl font-bold gradient-text mb-4">
						{t('title')}
					</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">
						{t('subtitle')}
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Contact Info Cards */}
					<div className="lg:col-span-1 space-y-6">
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

					{/* Contact Form */}
					<motion.div
						initial={{opacity: 0, x: 20}}
						whileInView={{opacity: 1, x: 0}}
						transition={{duration: 0.5, delay: 0.2}}
						viewport={{once: true}}
						className="lg:col-span-2"
					>
						<div className="p-8 rounded-2xl bg-bg-secondary border border-border">
							<h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
								<Send className="w-6 h-6 text-accent-primary" />
								{t('form.title')}
							</h3>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name Input */}
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
										{t('form.name')}
									</label>
									<input
										id="name"
										type="text"
										value={formData.name}
										onChange={handleChange('name')}
										placeholder={t('form.namePlaceholder')}
										disabled={formState === 'sending'}
										className={cn(
											'w-full px-4 py-3 rounded-lg',
											'bg-bg-primary border',
											errors.name ? 'border-red-500' : 'border-border',
											'text-text-primary placeholder:text-text-secondary',
											'focus:outline-none focus:ring-2',
											errors.name ? 'focus:ring-red-500' : 'focus:ring-accent-primary',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											'transition-all duration-200'
										)}
									/>
									{errors.name && (
										<p className="mt-2 text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.name}
										</p>
									)}
								</div>

								{/* Email Input */}
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
										{t('form.email')}
									</label>
									<input
										id="email"
										type="email"
										value={formData.email}
										onChange={handleChange('email')}
										placeholder={t('form.emailPlaceholder')}
										disabled={formState === 'sending'}
										className={cn(
											'w-full px-4 py-3 rounded-lg',
											'bg-bg-primary border',
											errors.email ? 'border-red-500' : 'border-border',
											'text-text-primary placeholder:text-text-secondary',
											'focus:outline-none focus:ring-2',
											errors.email ? 'focus:ring-red-500' : 'focus:ring-accent-primary',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											'transition-all duration-200'
										)}
									/>
									{errors.email && (
										<p className="mt-2 text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.email}
										</p>
									)}
								</div>

								{/* Message Textarea */}
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
										{t('form.message')}
									</label>
									<textarea
										id="message"
										value={formData.message}
										onChange={handleChange('message')}
										placeholder={t('form.messagePlaceholder')}
										disabled={formState === 'sending'}
										rows={6}
										className={cn(
											'w-full px-4 py-3 rounded-lg',
											'bg-bg-primary border',
											errors.message ? 'border-red-500' : 'border-border',
											'text-text-primary placeholder:text-text-secondary',
											'focus:outline-none focus:ring-2',
											errors.message ? 'focus:ring-red-500' : 'focus:ring-accent-primary',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											'transition-all duration-200',
											'resize-none'
										)}
									/>
									{errors.message && (
										<p className="mt-2 text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.message}
										</p>
									)}
								</div>

								{/* Submit Button */}
								<motion.button
									type="submit"
									disabled={formState === 'sending'}
									whileHover={formState === 'idle' || formState === 'error' ? {scale: 1.02} : undefined}
									whileTap={formState === 'idle' || formState === 'error' ? {scale: 0.98} : undefined}
									className={cn(
										'w-full flex items-center justify-center gap-2',
										'px-6 py-4 rounded-lg',
										'font-bold text-white',
										'transition-all duration-300',
										formState === 'idle' || formState === 'error'
											? 'bg-accent-primary hover:shadow-xl hover:shadow-accent-primary/40'
											: 'bg-accent-primary/50 cursor-not-allowed',
										'disabled:opacity-70'
									)}
								>
									{formState === 'sending' ? (
										<>
											<motion.div
												animate={{rotate: 360}}
												transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
												className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
											/>
											{t('form.sending')}
										</>
									) : (
										<>
											<Send className="w-5 h-5" />
											{t('form.submit')}
										</>
									)}
								</motion.button>

								{/* Success Message */}
								{formState === 'success' && (
									<motion.div
										initial={{opacity: 0, y: -10}}
										animate={{opacity: 1, y: 0}}
										className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
									>
										<CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<p className="text-sm text-green-500">
											{t('form.success')}
										</p>
									</motion.div>
								)}

								{/* Error Message */}
								{formState === 'error' && (
									<motion.div
										initial={{opacity: 0, y: -10}}
										animate={{opacity: 1, y: 0}}
										className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
									>
										<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<p className="text-sm text-red-500">
											{t('form.error')}
										</p>
									</motion.div>
								)}
							</form>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
