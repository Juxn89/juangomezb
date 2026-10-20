/** Home page sections, in page order. Each id is both the section's DOM id and its `nav.*` message key. */
export const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'blog'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/**
 * On the home page a section link is a same-page anchor; anywhere else it has to load the home page
 * first, or the link points at an element that is not there.
 */
export function sectionHref(id: SectionId, locale: string, isHome: boolean): string {
	return isHome ? `#${id}` : `/${locale}#${id}`;
}

/** The section a sub-page belongs to, so the header can still mark where the visitor is. */
export function sectionForPath(pathname: string): SectionId | null {
	return pathname === '/projects' || pathname.startsWith('/projects/') ? 'projects' : null;
}
