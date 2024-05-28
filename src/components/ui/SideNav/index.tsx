'use client'

import { useContext } from 'react'
import { PortfolioContext } from '@/context'
import { ContextType } from '@/common'
import './styles.css'

export const SideNav = () => {
	const { isOpenSideNav, closeSideNav } = useContext(PortfolioContext) as ContextType

	return(
		<div className={ `${ isOpenSideNav ? 'block' : 'hidden'} SideNav absolute bg-blue-800 text-white flex flex-col`}>
			<div className='flex flex-row-reverse p-2'>
				<span className='text-2xl' onClick={ () => closeSideNav() }>X</span>
			</div>
			<div className='w-full'>
				<ul>
					<li className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'>Home</li>
					<li className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'>Experience</li>
					<li className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'>Projects</li>
					<li className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'>Skill</li>
				</ul>
			</div>
		</div>
	)
}