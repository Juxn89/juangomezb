'use client'

import { useContext } from 'react'
import { ContextType } from '@/common'
import { PortfolioContext } from '@/context'
import { MenuIcon, SpainFlagIcon } from '@/components/ui/Icons'
import { MenuOutlined } from '@ant-design/icons'

export const Header = () => {
	const { openSideNav } = useContext(PortfolioContext) as ContextType

	return (
		<header className='flex justify-between'>
			<MenuOutlined className="text-white cursor-pointer text-3xl ml-2" onClick={ () => openSideNav() } />
			<SpainFlagIcon className='w-[45px] h-[45px] rounded-lg mr-2' />
		</header>
	)
}