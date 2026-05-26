'use client';

import {useRouter} from 'next/navigation';
import {motion} from 'framer-motion';
import {Home, ArrowLeft, Terminal, Code, Server, Database, Cpu} from 'lucide-react';
import {cn} from '@/lib/utils/cn';

export default function NotFound() {
	const router = useRouter();

	// Floating particles animation
	const particles = Array.from({length: 20}, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		delay: Math.random() * 2,
		duration: 3 + Math.random() * 2,
	}));

	// 404 number animation
	const number404Variants = {
		hidden: {opacity: 0, scale: 0.5, y: 50},
		visible: (i: number) => ({
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				delay: i * 0.1,
				duration: 0.8,
				ease: [0.22, 1, 0.36, 1],
			},
		}),
	};

	// Tech icon animation
	const iconVariants = {
		hidden: {opacity: 0, y: 20},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
				ease: 'easeOut',
			},
		},
	};

	const handleGoBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.push('/');
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-bg-primary via-bg-secondary to-bg-primary px-4 py-20">
			{/* Animated Background Orbs */}
			<div className="absolute inset-0 -z-10">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className="absolute top-20 left-20 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className="absolute bottom-20 right-20 w-125 h-125 bg-accent-secondary/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.25, 0.35, 0.25],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-tertiary/15 rounded-full blur-3xl"
				/>
			</div>

			{/* Floating Particles (Fireflies) */}
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute w-1 h-1 bg-accent-tertiary rounded-full"
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
					}}
					animate={{
						y: [-20, 20, -20],
						x: [-10, 10, -10],
						opacity: [0, 1, 0],
						scale: [0, 1.5, 0],
					}}
					transition={{
						duration: particle.duration,
						repeat: Infinity,
						delay: particle.delay,
						ease: 'easeInOut',
					}}
				/>
			))}

			{/* Main Content */}
			<div className="relative z-10 max-w-4xl mx-auto text-center">
			{/* Decorative Tech Icons */}
			<div className="absolute -top-20 left-0 opacity-20">
				<motion.div
					variants={iconVariants}
					initial="hidden"
					animate="visible"
				>
					<Terminal className="w-24 h-24 text-accent-primary" />
				</motion.div>
			</div>
			<div className="absolute -top-20 right-0 opacity-20">
				<motion.div
					variants={iconVariants}
					initial="hidden"
					animate="visible"
					transition={{delay: 0.2}}
				>
					<Code className="w-32 h-32 text-accent-secondary" />
					</motion.div>
				</div>

				{/* 404 Numbers */}
				<div className="flex items-center justify-center gap-4 mb-8">
					{['4', '0', '4'].map((digit, i) => (
						<motion.div
							key={i}
							custom={i}
							variants={number404Variants}
							initial="hidden"
							animate="visible"
							whileHover={{
								scale: 1.1,
								rotate: [0, -5, 5, 0],
								transition: {duration: 0.3},
							}}
							className="relative"
						>
							<span className="text-9xl md:text-[200px] font-black gradient-text pb-2 leading-none block">
								{digit}
							</span>
							{/* Glow effect */}
							<motion.div
								animate={{
									opacity: [0.3, 0.6, 0.3],
									scale: [0.95, 1.05, 0.95],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * 0.3,
								}}
								className="absolute inset-0 bg-accent-primary/20 blur-3xl -z-10 rounded-full"
							/>
						</motion.div>
					))}
				</div>

				{/* Title */}
				<motion.h1
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 0.5, duration: 0.6}}
					className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
				>
					404: Page Not Found
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 0.6, duration: 0.6}}
					className="text-xl md:text-2xl text-accent-primary font-medium mb-4"
				>
					Houston, we have a problem with this URL
				</motion.p>

				{/* Description */}
				<motion.p
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 0.7, duration: 0.6}}
					className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
				>
					The page you&apos;re trying to reach seems to be in another dimension. It might have been refactored, deprecated, or lost in a merge conflict.
				</motion.p>

				{/* Action Buttons */}
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{delay: 0.8, duration: 0.6}}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					{/* Go Back Button */}
					<motion.button
						onClick={handleGoBack}
						whileHover={{scale: 1.05, y: -2}}
						whileTap={{scale: 0.95}}
						className={cn(
							'inline-flex items-center gap-2 px-8 py-4 rounded-xl',
							'bg-bg-secondary border-2 border-accent-primary',
							'text-accent-primary font-bold text-lg',
							'hover:bg-accent-primary/10',
							'shadow-lg hover:shadow-xl hover:shadow-accent-primary/30',
							'transition-all duration-300'
						)}
					>
						<ArrowLeft className="w-5 h-5" />
						Go Back
					</motion.button>

					{/* Home Button */}
					<motion.a
						href="/"
						whileHover={{scale: 1.05, y: -2}}
						whileTap={{scale: 0.95}}
						className={cn(
							'inline-flex items-center gap-2 px-8 py-4 rounded-xl',
							'bg-linear-to-r from-accent-primary via-accent-secondary to-accent-tertiary',
							'text-white font-bold text-lg',
							'shadow-lg hover:shadow-xl hover:shadow-accent-primary/40',
							'transition-all duration-300',
							'relative overflow-hidden group'
						)}
					>
						{/* Shine effect */}
						<motion.div
							animate={{
								x: [-200, 200],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: 'linear',
							}}
							className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-1/2"
						/>
						<Home className="w-5 h-5 relative z-10" />
						<span className="relative z-10">Return Home</span>
					</motion.a>
				</motion.div>

				{/* Decorative Bottom Tech Icons */}
				<div className="mt-20 flex items-end justify-center gap-8 opacity-10">
					{[Terminal, Code, Server, Database, Cpu].map((Icon, i) => (
						<motion.div
							key={i}
							initial={{opacity: 0, y: 20}}
							animate={{opacity: 0.3, y: 0}}
							transition={{
								delay: 1 + i * 0.1,
								duration: 0.8,
							}}
						>
							<Icon
								className="text-accent-primary"
								style={{
									width: `${40 + i * 8}px`,
									height: `${40 + i * 8}px`,
								}}
							/>
						</motion.div>
					))}
				</div>
			</div>

			{/* Falling Leaves Animation */}
			{Array.from({length: 8}, (_, i) => (
				<motion.div
					key={`leaf-${i}`}
					className="absolute w-3 h-3 bg-accent-tertiary/40 rounded-full blur-sm"
					style={{
						left: `${10 + i * 12}%`,
						top: -20,
					}}
					animate={{
						y: ['0vh', '110vh'],
						x: [0, 30, -30, 0],
						rotate: [0, 360],
						opacity: [0, 0.6, 0],
					}}
					transition={{
						duration: 8 + i * 0.5,
						repeat: Infinity,
						delay: i * 0.8,
						ease: 'linear',
					}}
				/>
			))}
		</div>
	);
}
