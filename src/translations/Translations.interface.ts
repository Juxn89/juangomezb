export interface Translation {
	Commons: ICommons
	Flag: IFlag,
	Summary: ISummary,
	SocialMedia: ISocialMedia[],
	WorkExperience: IWorkExperience[],
	Projects: IProject[]
}

export interface ICommons {
	CurrentLabel: string,
	WorkExperienceSectionLabel: string
	ProjectsSectionLabel: string,
	SkillsLabel: string
}

export interface ISummary {	
	greeting: string,
	yearsOfExperience: string,
	grade: string,
	location: string,
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

export interface IProject {
	image: string,
	description: string,
	respository: string,
	demo: string
}