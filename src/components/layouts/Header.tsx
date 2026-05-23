'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/routing';
import {LocaleSwitcher} from '@/components/ui/LocaleSwitcher';
import {ThemeToggle} from '@/components/ui/ThemeToggle';
import {MobileMenu} from './MobileMenu';
import {Menu} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

const navigation = [
	{key: 'home', href: '#home'},
	{key: 'about', href: '#about'},
	{key: 'experience', href: '#experience'},
	{key: 'projects', href: '#projects'},
	{key: 'contact', href: '#contact'},
];

export function Header() {
	const t = useTranslations('nav');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState('home');

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
		e.preventDefault();
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({behavior: 'smooth'});
			setActiveSection(sectionId);
		}
	};

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-md">
				<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<a 
							href="#home" 
							onClick={(e) => handleNavClick(e, 'home')}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="text-xl font-bold gradient-text">JG</span>
						</a>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-6">
							{navigation.map(({key, href}) => {
								const sectionId = href.replace('#', '');
								const isActive = activeSection === sectionId;
								return (
									<a
										key={key}
										href={href}
										onClick={(e) => handleNavClick(e, sectionId)}
										className={cn(
											'text-sm font-medium transition-colors hover:text-accent-primary cursor-pointer',
											isActive ? 'text-accent-primary' : 'text-text-secondary'
										)}
									>
										{t(key)}
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
