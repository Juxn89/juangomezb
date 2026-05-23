'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/routing';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import {ThemeToggle} from '../ui/ThemeToggle';
import {LocaleSwitcher} from '../ui/LocaleSwitcher';

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileMenu({isOpen, onClose}: MobileMenuProps) {
	const t = useTranslations('nav');
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Prevent scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const navigation = [
		{name: t('home'), href: '/'},
		{name: t('about'), href: '/about'},
		{name: t('projects'), href: '/projects'},
		{name: t('experience'), href: '/experience'},
		{name: t('blog'), href: '/blog'},
		{name: t('contact'), href: '/contact'},
	];

	const menuVariants = {
		closed: {
			x: '100%',
			transition: {
				type: 'spring',
				stiffness: 400,
				damping: 40,
			},
		},
		open: {
			x: 0,
			transition: {
				type: 'spring',
				stiffness: 400,
				damping: 40,
			},
		},
	};

	const backdropVariants = {
		closed: {
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
		open: {
			opacity: 1,
			transition: {
				duration: 0.2,
			},
		},
	};

	const listItemVariants = {
		closed: {
			x: 50,
			opacity: 0,
		},
		open: (i: number) => ({
			x: 0,
			opacity: 1,
			transition: {
				delay: i * 0.1,
				type: 'spring',
				stiffness: 300,
				damping: 24,
			},
		}),
	};

	if (!mounted) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={backdropVariants}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
					/>

					{/* Menu Panel */}
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
						className={cn(
							'fixed top-0 right-0 bottom-0',
							'w-full max-w-sm',
							'bg-bg-primary border-l border-border',
							'shadow-2xl z-50',
							'md:hidden',
							'overflow-y-auto'
						)}
					>
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-border">
								<div>
									<h2 className="text-lg font-bold text-text-primary">Menu</h2>
									<p className="text-xs text-text-secondary mt-1">Navigation</p>
								</div>
								<button
									onClick={onClose}
									className={cn(
										'p-2 rounded-lg',
										'text-text-secondary hover:text-text-primary',
										'hover:bg-bg-secondary',
										'transition-colors duration-200',
										'focus:outline-none focus:ring-2 focus:ring-accent-primary'
									)}
									aria-label="Close menu"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							{/* Navigation Links */}
							<nav className="flex-1 p-6">
								<ul className="space-y-2">
									{navigation.map((item, index) => {
										const isActive = pathname === item.href;
										return (
											<motion.li
												key={item.href}
												custom={index}
												initial="closed"
												animate="open"
												exit="closed"
												variants={listItemVariants}
											>
												<Link
													href={item.href}
													onClick={onClose}
													className={cn(
														'flex items-center gap-3 px-4 py-3 rounded-lg',
														'text-base font-medium',
														'transition-all duration-200',
														'group',
														isActive
															? 'bg-accent-primary text-white shadow-md'
															: 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
													)}
												>
													<span
														className={cn(
															'w-1.5 h-1.5 rounded-full transition-transform',
															isActive
																? 'bg-white scale-100'
																: 'bg-accent-primary scale-0 group-hover:scale-100'
														)}
													/>
													{item.name}
												</Link>
											</motion.li>
										);
									})}
								</ul>
							</nav>

							{/* Bottom Actions */}
							<div className="p-6 border-t border-border space-y-4">
								<div>
									<p className="text-xs font-medium text-text-secondary mb-3">Theme</p>
									<ThemeToggle />
								</div>
								<div>
									<p className="text-xs font-medium text-text-secondary mb-3">Language</p>
									<LocaleSwitcher />
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
