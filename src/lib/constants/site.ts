export const GITHUB_USERNAME = 'juxn89';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const DEFAULT_SITE_URL = 'https://www.juangomezb.com';

/** Read per call, not at import, so tests and builds can set NEXT_PUBLIC_SITE_URL first. */
export function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export const FEATURED_PROJECTS_LIMIT = 4;
