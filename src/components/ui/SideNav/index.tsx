'use client'

import { useContext } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { PortfolioContext } from '@/context'
import { ContextType } from '@/common'
import './styles.css'

export const SideNav = () => {
	const { isOpenSideNav, closeSideNav } = useContext(PortfolioContext) as ContextType

	return(
		<div className={ `${ isOpenSideNav ? 'block' : 'hidden'} SideNav absolute bg-blue-800 text-white flex flex-col`}>
			<div className='flex flex-row-reverse p-2'>
				<CloseOutlined className='text-2xl' onClick={ () => closeSideNav() } />
			</div>
			<div className='w-full'>
				<ul>
					<li 
						className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'
					>
						<a href='#home' onClick={ () => closeSideNav() }>Home</a>
					</li>
					<li 
						className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'
					>
						<a href='#WorkExperience onClick={ () => closeSideNav() }'>Experience</a>						
					</li>
					<li 
						className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'
					>
						<a href='#Projects' onClick={ () => closeSideNav() }>Projects</a>						
					</li>
					<li className='text-2xl hover:bg-blue-300 hover:text-blue-950 cursor-pointer m-0 p-2 font-medium'>Skill</li>
				</ul>
			</div>
		</div>
	)
}