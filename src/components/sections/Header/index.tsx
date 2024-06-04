'use client'

import { useContext } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { ContextType } from '@/common'
import { PortfolioContext } from '@/context'
import { SpainFlagIcon } from '@/components/ui/Icons'

export const Header = () => {
	const { openSideNav } = useContext(PortfolioContext) as ContextType

	return (
		<header className='flex justify-between md:flex-row-reverse'>
			<MenuOutlined className="text-white cursor-pointer text-3xl ml-2 md:hidden" onClick={ () => openSideNav() } />
			<SpainFlagIcon className='w-[45px] h-[45px] rounded-lg mr-2' />
		</header>
	)
}