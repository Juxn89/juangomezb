import {HTMLAttributes, forwardRef} from 'react';
import {cn} from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({className, variant = 'default', ...props}, ref) => {
		const variants = {
			default: 'bg-bg-secondary text-text-primary border border-border',
			primary: 'bg-accent-primary text-white',
			secondary: 'bg-accent-secondary text-white',
			success: 'bg-success text-white',
			warning: 'bg-warning text-white',
			error: 'bg-error text-white',
		};

		return (
			<span
				ref={ref}
				className={cn(
					'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
					variants[variant],
					className
				)}
				{...props}
			/>
		);
	}
);

Badge.displayName = 'Badge';

export {Badge};
