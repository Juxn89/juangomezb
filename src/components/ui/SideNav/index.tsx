'use client'

import { useContext } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { PortfolioContext } from '@/context'
import { ContextType } from '@/common'
import './styles.css'

export const SideNav = () => {
	const { isOpenSideNav, closeSideNav } = useContext(PortfolioContext) as ContextType
	const menuLinks = [
		{ label: 'Home', link: '#home' },
		{ label: 'Experience', link: '#WorkExperiences' },
		{ label: 'Projects', link: '#Projects' },
		{ label: 'Skills', link: '#Skills' },
	]

	return(
		<div className={ `${ isOpenSideNav ? 'block' : 'hidden'} SideNav absolute bg-slate-700 text-white flex flex-col`}>
			<div className='flex flex-row-reverse p-2'>
				<CloseOutlined className='text-2xl' onClick={ () => closeSideNav() } />
			</div>
			<div className='w-full'>
				<ul>
					{
						menuLinks.map(menu => (
							<li
								key={ menu.label }
								className='text-2xl hover:bg-slate-500 hover:text-white cursor-pointer m-0 p-2 font-medium'
							>
								<a href={ menu.link } onClick={ () => closeSideNav() }> { menu.label } </a>
							</li>
						))
					}
				</ul>
			</div>
		</div>
	)
}