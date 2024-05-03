'use client'

import { FC } from 'react'
import { MdDarkMode } from 'react-icons/md'
import './ThemeMode.css'

export const ThemeMode: FC = () => {
	return(
		<>
		  <MdDarkMode className='themeModeButton' title='Change to dark mode' />
		</>
	);
}