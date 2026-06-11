'use client';

import {useEffect, useState} from 'react';

export default function Template({children}: {children: React.ReactNode}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = requestAnimationFrame(() => setIsVisible(true));
		return () => cancelAnimationFrame(timer);
	}, []);

	return (
		<div
			className="transition-opacity duration-300 ease-in-out"
			style={{opacity: isVisible ? 1 : 0}}
		>
			{children}
		</div>
	);
}
