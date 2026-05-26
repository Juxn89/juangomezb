'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Mail} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

// Custom SVG Icons
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

const LinkedinIcon = ({className}: {className?: string}) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
		aria-hidden="true"
	>
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
	</svg>
);

export function Footer() {
	const tFooter = useTranslations('footer');
	const locale = useLocale();
	const currentYear = new Date().getFullYear();

	const linkedinUrl = locale === 'es' 
		? 'https://linkedin.com/in/jcgomez89?locale=es_ES'
		: 'https://linkedin.com/in/jcgomez89';

	const socialLinks = [
		{
			name: 'GitHub',
			href: 'https://github.com/juxn89',
			icon: GithubIcon,
			ariaLabel: 'Visit GitHub profile',
		},
		{
			name: 'LinkedIn',
			href: linkedinUrl,
			icon: LinkedinIcon,
			ariaLabel: 'Visit LinkedIn profile',
		},
		{
			name: 'Email',
			href: 'mailto:gb.jc@outlook.com',
			icon: Mail,
			ariaLabel: 'Send email',
		},
	];

	return (
		<footer className="border-t border-border bg-bg-secondary">
			<div className="container mx-auto px-4 py-16 md:py-20">
				{/* Logo/Name Section */}
				<div className="text-center">
					<h3 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
						{tFooter('name')}
					</h3>
					<p className="text-sm md:text-base text-text-secondary/90">
						{tFooter('tagline')}
					</p>
					
					{/* Decorative Line */}
					<div className="mt-6 flex items-center justify-center gap-3">
						<div className="h-px w-12 bg-linear-to-r from-transparent via-accent-primary/50 to-transparent" />
						<div className="w-1.5 h-1.5 rounded-full bg-accent-primary/70" />
						<div className="h-px w-12 bg-linear-to-r from-transparent via-accent-primary/50 to-transparent" />
					</div>
				</div>

				{/* Social Links */}
				<div className="flex justify-center gap-5 mt-10">
					{socialLinks.map((link) => {
						const Icon = link.icon;
						return (
							<a
								key={link.name}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.ariaLabel}
								className={cn(
									'w-14 h-14 rounded-full',
									'flex items-center justify-center',
									'bg-bg-primary border-2 border-border',
									'text-text-secondary',
									'hover:bg-accent-primary hover:border-accent-primary hover:text-white',
									'hover:scale-110 hover:shadow-lg hover:shadow-accent-primary/25',
									'active:scale-95',
									'transition-all duration-300 ease-out',
									'group'
								)}
							>
								<Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
							</a>
						);
					})}
				</div>

				{/* Divider */}
				<div className="mt-12 mb-8 h-px bg-linear-to-r from-transparent via-border to-transparent" />

				{/* Copyright & Made With */}
				<div className="text-center space-y-3">
					<p className="text-sm text-text-secondary/90">
						© {currentYear} {tFooter('name')}. {tFooter('rights')}
					</p>
					<p className="text-xs text-text-secondary/90 font-medium">
						{tFooter('madeWith')}
					</p>
				</div>
			</div>
		</footer>
	);
}
