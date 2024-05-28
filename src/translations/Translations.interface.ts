export interface Translation {
	Commons: ICommons
	Flag: IFlag,
	About: IAbout,
	SocialMedia: ISocialMedia[],
	WorkExperience: IWorkExperience[],
}

export interface ICommons {
	CurrentLabel: string,
	WorkExperienceSectionLabel: string
	ProjectsSectionLabel: string,
	SkillsLabel: string
}

export interface IAbout {	
	greeting: string,
	description: string
}

export interface IFlag {
	title: string,
	code: 'ES' | 'US'
	alt: string
}

export interface ISocialMedia {
	icon?: any,
	link: string,
	title: string,
}

export interface IWorkExperience {
	positionName: string,
	companyName: string,
	summary: string,
	startDate: string,
	endDate?: string,
	isCurrent: boolean,
	tags: string[]
}