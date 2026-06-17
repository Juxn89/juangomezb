/**
 * Dev.to API Integration
 * Fetches blog posts from Dev.to public API
 */

export type DevToArticle = {
	id: number;
	title: string;
	description: string;
	url: string;
	published_at: string;
	cover_image: string | null;
	tag_list: string[];
	reading_time_minutes: number;
	public_reactions_count: number;
	comments_count: number;
	published_timestamp: string;
	slug: string;
	language: string;
};

const DEV_TO_USERNAME = 'jgomezdev';
const DEV_TO_API_URL = 'https://dev.to/api/articles/latest';

/**
 * Fetch articles from Dev.to for a specific user, filtered by locale language.
 * @param username - Dev.to username (default: jgomezdev)
 * @param locale - Locale code used to filter articles by language ('en' | 'es')
 * @param limit - Number of articles to return after filtering (default: 6)
 * @returns Array of Dev.to articles matching the locale language
 */
export async function getDevToArticles(
	username: string = DEV_TO_USERNAME,
	locale: string = 'en',
	limit: number = 6
): Promise<DevToArticle[]> {
	try {
		// Fetch more than needed to account for filtering by language
		const url = new URL(DEV_TO_API_URL);
		url.searchParams.set('username', username);
		url.searchParams.set('per_page', String(limit * 2));

		const response = await fetch(url.toString(), {
			next: {
				revalidate: 1800, // Revalidate every 30 minutes
				tags: ['devto-articles'],
			},
		});

		if (!response.ok) {
			throw new Error(`Dev.to API error: ${response.status} ${response.statusText}`);
		}

		const articles: DevToArticle[] = await response.json();

		return articles
			.filter((a) => a.published_at !== null && a.language === locale)
			.slice(0, limit);
	} catch (error) {
		console.error('Error fetching Dev.to articles:', error);
		return [];
	}
}

/**
 * Format date to locale string
 * @param dateString - ISO date string
 * @param locale - Locale code (en, es)
 * @returns Formatted date string
 */
export function formatArticleDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
