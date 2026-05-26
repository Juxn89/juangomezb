import {HTMLAttributes, forwardRef} from 'react';
import {cn} from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'elevated' | 'interactive';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({className, variant = 'default', ...props}, ref) => {
		const variants = {
			default: 'bg-bg-secondary border border-border',
			elevated: 'bg-bg-secondary border border-border shadow-lg',
			interactive:
				'bg-bg-secondary border border-border hover:border-accent-primary transition-all duration-200 hover:shadow-md cursor-pointer',
		};

		return (
			<div ref={ref} className={cn('rounded-lg p-6', variants[variant], className)} {...props} />
		);
	}
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({className, ...props}, ref) => {
		return <div ref={ref} className={cn('mb-4', className)} {...props} />;
	}
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
	({className, ...props}, ref) => {
		return (
			<h3
				ref={ref}
				className={cn('text-2xl font-bold text-text-primary', className)}
				{...props}
			/>
		);
	}
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({className, ...props}, ref) => {
		return (
			<p
				ref={ref}
				className={cn('text-sm text-text-secondary mt-2', className)}
				{...props}
			/>
		);
	}
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({className, ...props}, ref) => {
		return <div ref={ref} className={cn('', className)} {...props} />;
	}
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({className, ...props}, ref) => {
		return (
			<div
				ref={ref}
				className={cn('mt-6 pt-4 border-t border-border', className)}
				{...props}
			/>
		);
	}
);

CardFooter.displayName = 'CardFooter';

export {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter};
