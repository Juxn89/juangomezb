/**
 * GitHub API integration for fetching repository data
 */

export interface GitHubRepo {
	id: string;
	name: string;
	description: string | null;
	url: string;
	homepageUrl: string | null;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: {
		name: string;
	} | null;
	repositoryTopics: {
		nodes: Array<{
			topic: {
				name: string;
			};
		}>;
	};
	createdAt: string;
	updatedAt: string;
	pushedAt: string;
}

export interface ProjectData {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	highlights: string[];
	demoUrl: string;
	codeUrl?: string;
	featured: boolean;
	stars?: number;
	language?: string | null;
}

/**
 * Fetch pinned GitHub repositories using GraphQL API
 * @param username GitHub username
 */
export async function fetchPinnedRepos(username: string): Promise<GitHubRepo[]> {
	const query = `
		query {
			user(login: "${username}") {
				pinnedItems(first: 6, types: REPOSITORY) {
					nodes {
						... on Repository {
							id
							name
							description
							url
							homepageUrl
							stargazerCount
							forkCount
							primaryLanguage {
								name
							}
							repositoryTopics(first: 10) {
								nodes {
									topic {
										name
									}
								}
							}
							createdAt
							updatedAt
							pushedAt
						}
					}
				}
			}
		}
	`;

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.github.v4+json',
				// GitHub Token is required for GraphQL API
				...(process.env.GITHUB_TOKEN
					? {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`}
					: {}),
			},
			body: JSON.stringify({query}),
			// Revalidate every hour
			next: {revalidate: 3600},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (data.errors) {
			throw new Error(`GitHub GraphQL error: ${JSON.stringify(data.errors)}`);
		}

		return data.data?.user?.pinnedItems?.nodes || [];
	} catch (error) {
		console.error('Error fetching pinned GitHub repos:', error);
		throw error;
	}
}

/**
 * Transform GitHub repo data to project format
 */
export function transformRepoToProject(repo: GitHubRepo, locale: string = 'en'): ProjectData {
	// Extract technologies from topics and language
	const technologies: string[] = [];

	// Add primary language
	if (repo.primaryLanguage?.name) {
		technologies.push(repo.primaryLanguage.name);
	}

	// Add topics as technologies
	const topics = repo.repositoryTopics.nodes.map((node) => node.topic.name);
	technologies.push(...topics.slice(0, 5));

	// Generate highlights based on repo metadata
	const highlights: string[] = [];

	if (repo.stargazerCount > 0) {
		highlights.push(
			locale === 'es'
				? `⭐ ${repo.stargazerCount} estrellas en GitHub`
				: `⭐ ${repo.stargazerCount} GitHub stars`
		);
	}

	if (repo.forkCount > 0) {
		highlights.push(
			locale === 'es' ? `🔀 ${repo.forkCount} forks` : `🔀 ${repo.forkCount} forks`
		);
	}

	// Add language as highlight if available
	if (repo.primaryLanguage?.name) {
		highlights.push(
			locale === 'es'
				? `💻 Desarrollado en ${repo.primaryLanguage.name}`
				: `💻 Built with ${repo.primaryLanguage.name}`
		);
	}

	// Determine if featured (all pinned repos are featured)
	const featured = true;

	// Format title (capitalize and replace hyphens/underscores with spaces)
	const title = repo.name
		.replace(/[-_]/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return {
		id: repo.id,
		title,
		description:
			repo.description ||
			(locale === 'es' ? 'Sin descripción disponible' : 'No description available'),
		technologies: [...new Set(technologies)], // Remove duplicates
		highlights,
		demoUrl: repo.homepageUrl || repo.url,
		codeUrl: repo.url,
		featured,
		stars: repo.stargazerCount,
		language: repo.primaryLanguage?.name || null,
	};
}

/**
 * Get pinned projects from GitHub
 */
export async function getPinnedProjects(
	username: string,
	locale: string = 'en',
	limit: number = 4
): Promise<ProjectData[]> {
	try {
		const repos = await fetchPinnedRepos(username);

		// Transform to project format
		const projects = repos.map((repo) => transformRepoToProject(repo, locale));

		// Sort by stars (handle undefined values)
		const sorted = projects.sort((a, b) => (b.stars || 0) - (a.stars || 0));

		return sorted.slice(0, limit);
	} catch (error) {
		console.error('Error getting pinned projects:', error);
		// Return empty array on error instead of throwing
		return [];
	}
}
