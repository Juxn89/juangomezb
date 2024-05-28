import { ContextType } from '@/common';
import { FC, createContext, useState } from 'react';

type ContextProps = {
	children: React.ReactNode | React.ReactNode[]
}

export const PortfolioContext = createContext<ContextType | null>(null)

export const PortfolioProvider: FC<ContextProps> = ({ children }) => {
	const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false)
	const openSideNav = () => {
		console.log('algo....')
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