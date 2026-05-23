'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/routing';
import {LocaleSwitcher} from '@/components/ui/LocaleSwitcher';
import {ThemeToggle} from '@/components/ui/ThemeToggle';
import {cn} from '@/lib/utils/cn';

const navigation = [
	{key: 'home', href: '/'},
	{key: 'about', href: '/about'},
	{key: 'projects', href: '/projects'},
	{key: 'experience', href: '/experience'},
	{key: 'blog', href: '/blog'},
	{key: 'contact', href: '/contact'},
];

export function Header() {
	const t = useTranslations('nav');
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-md">
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<span className="text-xl font-bold gradient-text">JG</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						{navigation.map(({key, href}) => {
							const isActive = pathname === href;
							return (
								<Link
									key={key}
									href={href}
									className={cn(
										'text-sm font-medium transition-colors hover:text-accent-primary',
										isActive
											? 'text-accent-primary'
											: 'text-text-secondary'
									)}
								>
									{t(key)}
								</Link>
							);
						})}
					</div>

					{/* Right side controls */}
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<LocaleSwitcher />
					</div>
				</div>
			</nav>
		</header>
	);
}
