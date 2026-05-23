import {cn} from '@/lib/utils/cn';
import type {ReactNode} from 'react';

interface ToggleGroupProps {
	children: ReactNode;
	className?: string;
}

export function ToggleGroup({children, className}: ToggleGroupProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-1 p-1 rounded-lg',
				'bg-bg-secondary border border-border',
				'h-10', // Fixed height for consistency
				className
			)}
		>
			{children}
		</div>
	);
}

interface ToggleItemProps {
	active?: boolean;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
	'aria-label'?: string;
	title?: string;
	'aria-current'?: string;
}

export function ToggleItem({
	active = false,
	children,
	className,
	onClick,
	'aria-label': ariaLabel,
	title,
	'aria-current': ariaCurrent,
}: ToggleItemProps) {
	const baseClasses = cn(
		'px-3 py-1.5 rounded-md text-sm font-medium',
		'flex items-center justify-center gap-2',
		'transition-all duration-300 ease-in-out',
		'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1',
		'min-h-[32px]', // Consistent inner height
		className
	);

	if (active) {
		return (
			<div
				className={cn(
					baseClasses,
					'bg-accent-primary text-white shadow-md cursor-default'
				)}
				aria-current={ariaCurrent || 'true'}
				aria-label={ariaLabel}
				title={title}
			>
				{children}
			</div>
		);
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				baseClasses,
				'text-text-secondary hover:text-text-primary',
				'hover:bg-bg-primary hover:scale-105 active:scale-95'
			)}
			aria-label={ariaLabel}
			title={title}
		>
			{children}
		</button>
	);
}
