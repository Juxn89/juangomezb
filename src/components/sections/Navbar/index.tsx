'use client'

import { FC, useState } from 'react';
import Flag from 'react-world-flags';
import './Navbar.css'
import { redirect } from 'next/navigation';

export const Navbar: FC = () => {
	const [Language, setLanguage] = useState<'es' | 'en' | 'us'>('es')

	const changeLanguage = () => {
		const newLanguage = Language === 'es' ? 'us' : 'es';
		setLanguage(newLanguage)

		redirect('/es')
	}

	return(
		<nav>
			<Flag 
				className='flag' 
				code={ Language } 
				height={40} 
				width={40} 
				alt='language_flag' 
				title='Spanish Version'
				onClick={ changeLanguage }
			/>				
		</nav>
	)
}