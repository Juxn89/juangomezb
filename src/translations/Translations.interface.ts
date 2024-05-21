import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export interface Translation {
	Commons: ICommons
	Flag: IFlag,
	Summary: ISummary,
	SocialMedia: ISocialMedia[],
	WorkExperience: IWorkExperience[],
}

export interface ICommons {
	CurrentLabel: string,
	WorkExperienceSectionLabel: string
	ProjectsSectionLabel: string,
	SkillsLabel: string
}

export interface ISummary {	
	greeting: string,
	description: string
}

export interface IFlag {
	title: string,
	code: 'ES' | 'US'
	alt: string
}

export interface ISocialMedia {
	icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>>,
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