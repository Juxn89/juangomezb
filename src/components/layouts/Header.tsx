'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {LocaleSwitcher} from '@/components/ui/LocaleSwitcher';
import {ThemeToggle} from '@/components/ui/ThemeToggle';
import dynamic from 'next/dynamic';
import {Menu} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import {SECTION_IDS} from '@/lib/constants/navigation';
import {useSectionNavigation} from '@/lib/hooks/useSectionNavigation';

// Lazy load MobileMenu - only loads when needed (mobile devices)
const MobileMenu = dynamic(() => import('./MobileMenu').then(mod => ({default: mod.MobileMenu})), {
	ssr: false,
});

export function Header() {
	const t = useTranslations('nav');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const {current, hrefFor, handleClick} = useSectionNavigation();

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-md">
				<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<a
							href={hrefFor('home')}
							onClick={(e) => handleClick(e, 'home')}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="text-xl font-bold gradient-text">JG</span>
						</a>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-6">
							{SECTION_IDS.map((id) => {
								const isActive = current === id;
								return (
									<a
										key={id}
										href={hrefFor(id)}
										onClick={(e) => handleClick(e, id)}
										aria-current={isActive ? 'location' : undefined}
										className={cn(
											'text-sm font-medium transition-colors hover:text-accent-primary cursor-pointer',
											isActive ? 'text-accent-primary' : 'text-text-secondary'
										)}
									>
										{t(id)}
									</a>
								);
							})}
						</div>

						{/* Right side controls */}
						<div className="flex items-center gap-4">
							{/* Desktop theme and locale */}
							<div className="hidden md:flex items-center gap-4">
								<ThemeToggle />
								<LocaleSwitcher />
							</div>

							{/* Mobile menu button */}
							<button
								onClick={() => setMobileMenuOpen(true)}
								className={cn(
									'md:hidden p-2 rounded-lg',
									'text-text-secondary hover:text-text-primary',
									'hover:bg-bg-secondary',
									'transition-colors duration-200',
									'focus:outline-none focus:ring-2 focus:ring-accent-primary'
								)}
								aria-label="Open menu"
							>
								<Menu className="w-6 h-6" />
							</button>
						</div>
					</div>
				</nav>
			</header>

			{/* Mobile Menu */}
			<MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
		</>
	);
}
