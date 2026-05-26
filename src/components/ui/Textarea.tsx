import {TextareaHTMLAttributes, forwardRef} from 'react';
import {cn} from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({className, label, error, id, ...props}, ref) => {
		const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={textareaId}
						className="block text-sm font-medium text-text-primary mb-2"
					>
						{label}
					</label>
				)}
				<textarea
					id={textareaId}
					ref={ref}
					className={cn(
						'w-full px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary',
						'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
						'placeholder:text-text-secondary',
						'transition-all duration-200',
						'disabled:opacity-50 disabled:cursor-not-allowed',
					'resize-y min-h-25',
						error && 'border-error focus:ring-error',
						className
					)}
					{...props}
				/>
				{error && <p className="mt-1 text-sm text-error">{error}</p>}
			</div>
		);
	}
);

Textarea.displayName = 'Textarea';

export {Textarea};
