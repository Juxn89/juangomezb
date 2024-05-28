export type SvgProps = {
	className?: string,
	title?: string,
	onClick?: () => void
}

export type ContextType = {
	isOpenSideNav: boolean,
	openSideNav: () => void,
	closeSideNav: () => void
}

export type LanguagesType = 'es' | 'en'