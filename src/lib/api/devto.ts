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
};

const DEV_TO_USERNAME = 'jgomezdev';
const DEV_TO_API_URL = 'https://dev.to/api/articles';

/**
 * Fetch articles from Dev.to for a specific user
 * @param username - Dev.to username (default: jgomezdev)
 * @param limit - Number of articles to fetch (default: 6)
 * @returns Array of Dev.to articles
 */
export async function getDevToArticles(
	username: string = DEV_TO_USERNAME,
	limit: number = 6
): Promise<DevToArticle[]> {
	try {
		const response = await fetch(`${DEV_TO_API_URL}?username=${username}&per_page=${limit}`, {
			next: {
				revalidate: 3600, // Revalidate every hour (ISR)
			},
		});

		if (!response.ok) {
			throw new Error(`Dev.to API error: ${response.status}`);
		}

		const articles: DevToArticle[] = await response.json();
		return articles;
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
