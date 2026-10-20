import type {ReactNode} from 'react';
import {Link} from '@/routing';
import {cn} from '@/lib/utils/cn';

interface LinkButtonProps {
	href: string;
	children: ReactNode;
	icon?: ReactNode;
	variant?: 'primary' | 'secondary';
	/** External links open in a new tab; internal ones navigate in place and keep the current locale. */
	external?: boolean;
	className?: string;
}

const baseClasses =
	'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary';

const variantClasses = {
	primary:
		'border-transparent bg-accent-primary text-white shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/40',
	secondary:
		'border-border bg-bg-primary text-text-primary hover:border-accent-primary hover:text-accent-primary',
};

export function LinkButton({
	href,
	children,
	icon,
	variant = 'primary',
	external = true,
	className,
}: LinkButtonProps) {
	const classes = cn(baseClasses, variantClasses[variant], className);
	const content = (
		<>
			{icon && <span className="w-4 h-4 shrink-0" aria-hidden="true">{icon}</span>}
			<span className="whitespace-nowrap">{children}</span>
		</>
	);

	if (!external) {
		return (
			<Link href={href} className={classes}>
				{content}
			</Link>
		);
	}

	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
			{content}
		</a>
	);
}
