export const GITHUB_USERNAME = 'juxn89';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
export const CONTACT_EMAIL = 'gb.jc@outlook.com';

const DEFAULT_SITE_URL = 'https://www.juangomezb.com';

/** Read per call, not at import, so tests and builds can set NEXT_PUBLIC_SITE_URL first. */
export function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

/** A multiple of the grid's 2 and 3 columns, so the home section never ends on a half-empty row. */
export const FEATURED_PROJECTS_LIMIT = 6;
