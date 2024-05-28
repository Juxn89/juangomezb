'use client'

import { useContext } from 'react'
import { ContextType } from '@/common'
import { PortfolioContext } from '@/context'
import { MenuIcon, SpainFlagIcon } from '@/components/ui/Icons'

export const Header = () => {
	const { openSideNav } = useContext(PortfolioContext) as ContextType

	return (
		<header className='flex justify-between'>
			<MenuIcon className="text-white w-[45px] h-[45px] cursor-pointer" onClick={ () => openSideNav() }/>
			<SpainFlagIcon className='w-[45px] h-[45px] rounded-lg mr-2' />
		</header>
	)
}