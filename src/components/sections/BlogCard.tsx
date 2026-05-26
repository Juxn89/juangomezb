'use client';

import {motion} from 'framer-motion';
import {ExternalLink, Clock, Heart, MessageCircle} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import type {DevToArticle} from '@/lib/api/devto';
import {formatArticleDate} from '@/lib/api/devto';
import {useLocale, useTranslations} from 'next-intl';
import Image from 'next/image';

type BlogCardProps = {
	article: DevToArticle;
	index: number;
};

export function BlogCard({article, index}: BlogCardProps) {
	const t = useTranslations('blog');
	const locale = useLocale();

	const itemVariants = {
		hidden: {opacity: 0, y: 20},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				delay: index * 0.1,
				ease: [0.22, 1, 0.36, 1] as const,
			},
		},
	};

	return (
		<motion.article
			variants={itemVariants}
			whileHover={{y: -8}}
			className={cn(
				'group relative overflow-hidden rounded-2xl',
				'bg-bg-secondary border border-border',
				'hover:border-accent-primary/50',
				'transition-all duration-300',
				'shadow-lg hover:shadow-accent-primary/20'
			)}
		>
			{/* Cover Image */}
			{article.cover_image && (
				<div className="relative w-full h-48 overflow-hidden bg-bg-tertiary">
					<Image
						src={article.cover_image}
						alt={article.title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-bg-secondary/80 to-transparent" />
				</div>
			)}

			{/* Content */}
			<div className="p-6">
				{/* Tags */}
				{article.tag_list.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{article.tag_list.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className={cn(
									'px-3 py-1 rounded-full text-xs font-medium',
									'bg-accent-primary/10 text-accent-primary',
									'border border-accent-primary/20'
								)}
							>
								#{tag}
							</span>
						))}
					</div>
				)}

				{/* Title */}
				<h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-accent-primary transition-colors">
					{article.title}
				</h3>

				{/* Description */}
				<p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
					{article.description}
				</p>

				{/* Meta Info */}
				<div className="flex items-center justify-between text-xs text-text-secondary mb-4">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							{article.reading_time_minutes} min
						</span>
						<span className="flex items-center gap-1">
							<Heart className="w-4 h-4" />
							{article.public_reactions_count}
						</span>
						<span className="flex items-center gap-1">
							<MessageCircle className="w-4 h-4" />
							{article.comments_count}
						</span>
					</div>
				</div>

				{/* Date */}
				<p className="text-xs text-text-secondary mb-4">
					{t('publishedOn')} {formatArticleDate(article.published_at, locale)}
				</p>

				{/* Read More Link */}
				<a
					href={article.url}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
						'bg-accent-primary/10 text-accent-primary',
						'hover:bg-accent-primary hover:text-white',
						'border border-accent-primary/20',
						'transition-all duration-300',
						'text-sm font-medium'
					)}
				>
					{t('readMore')}
					<ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</a>
			</div>

			{/* Hover Glow Effect */}
			<div className="absolute -inset-0.5 bg-linear-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
		</motion.article>
	);
}
