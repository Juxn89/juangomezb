'use client';

import {motion} from 'framer-motion';
import {ReactNode} from 'react';

interface LinkButtonProps {
	href: string;
	children: ReactNode;
	icon?: ReactNode;
	variant?: 'primary' | 'secondary';
	className?: string;
}

export function LinkButton({
	href,
	children,
	icon,
	variant = 'primary',
	className = '',
}: LinkButtonProps) {
	const baseClasses =
		'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition-all min-w-[140px]';

	const variantClasses = {
		primary:
			'border-transparent bg-accent-primary text-white shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/40',
		secondary:
			'border-border bg-bg-primary text-text-primary hover:border-accent-primary hover:text-accent-primary',
	};

	return (
		<motion.a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			whileHover={{scale: 1.05}}
			whileTap={{scale: 0.95}}
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		>
			{icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
			<span className="whitespace-nowrap">{children}</span>
		</motion.a>
	);
}
