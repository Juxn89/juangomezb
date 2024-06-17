'use client'

import Link from 'next/link'
import { FC, useContext } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { ContextType } from '@/common'
import { PortfolioContext } from '@/context'

type HeaderProps = {
	children: JSX.Element | JSX.Element[],
	labels: {
		src: string,
		title: string
	}
}

export const Header: FC<HeaderProps> = ({ children, labels }) => {
	const { src, title } = labels
	const { openSideNav } = useContext(PortfolioContext) as ContextType

	return (
		<header className='flex justify-between md:flex-row-reverse'>
			<MenuOutlined className="text-white cursor-pointer text-3xl ml-2 md:hidden" onClick={ () => openSideNav() } />
				<Link
					href={ src }
					title={ title }
					className='rounded-full'
				>
					{ children }
				</Link>
		</header>
	)
}