'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

export default function Template({children}: {children: React.ReactNode}) {
	const pathname = usePathname();
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Fade out
		setIsVisible(false);
		
		// Fade in after a brief delay
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<div
			className="transition-opacity duration-150 ease-in-out"
			style={{opacity: isVisible ? 1 : 0}}
		>
			{children}
		</div>
	);
}
