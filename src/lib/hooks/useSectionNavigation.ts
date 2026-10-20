'use client';

import {useCallback, useEffect, useState} from 'react';
import {useLocale} from 'next-intl';
import {usePathname} from '@/routing';
import {SECTION_IDS, sectionForPath, sectionHref, type SectionId} from '@/lib/constants/navigation';

const OBSERVER_OPTIONS: IntersectionObserverInit = {
	root: null,
	rootMargin: '-20% 0px -60% 0px',
	threshold: 0.1,
};

function isSectionId(id: string): id is SectionId {
	return (SECTION_IDS as readonly string[]).includes(id);
}

/**
 * Shared by the header and the mobile menu: which section is current, where each link points, and the
 * smooth scroll on the home page. Off the home page the links navigate normally.
 */
export function useSectionNavigation(onNavigate?: () => void) {
	const locale = useLocale();
	const pathname = usePathname();
	const isHome = pathname === '/';
	const [observed, setObserved] = useState<SectionId>('home');

	useEffect(() => {
		if (!isHome) return;

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && isSectionId(entry.target.id)) {
					setObserved(entry.target.id);
				}
			}
		}, OBSERVER_OPTIONS);

		for (const id of SECTION_IDS) {
			const section = document.getElementById(id);
			if (section) observer.observe(section);
		}

		return () => observer.disconnect();
	}, [isHome]);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
			if (isHome) {
				const section = document.getElementById(id);
				if (section) {
					event.preventDefault();
					section.scrollIntoView({behavior: 'smooth'});
					setObserved(id);
				}
			}
			onNavigate?.();
		},
		[isHome, onNavigate]
	);

	return {
		current: isHome ? observed : sectionForPath(pathname),
		hrefFor: (id: SectionId) => sectionHref(id, locale, isHome),
		handleClick,
	};
}
