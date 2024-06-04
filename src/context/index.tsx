'use client'

import { FC, createContext, useState } from 'react';
import { ContextType } from '@/common';

type ContextProps = {
	children: React.ReactNode | React.ReactNode[]
}

export const PortfolioContext = createContext<ContextType | null>(null)

export const PortfolioProvider: FC<ContextProps> = ({ children }) => {
	const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false)
	const openSideNav = () => {
		setIsOpenSideNav(true)
	}
	const closeSideNav = () => setIsOpenSideNav(false)

	return (
		<PortfolioContext.Provider value={{
			isOpenSideNav,
			openSideNav,
			closeSideNav
		}} >
			{ children }
		</PortfolioContext.Provider>
	)
}