'use client'

import { FC } from 'react';
import Flag from 'react-world-flags';
import Image from 'next/image'
import { ThemeMode } from '@/components/ui'
import './Navbar.css'

export const Navbar: FC = () => {
	return(
		<nav>
			<ThemeMode />
			<Flag 
				className='flag' 
				code='ES' 
				height={40} 
				width={40} 
				alt='flag' 
				title='flag'
			/>				
		</nav>
	)
}