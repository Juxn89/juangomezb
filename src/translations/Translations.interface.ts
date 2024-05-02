import { IconType } from 'react-icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export interface Translation {
	Commons: ICommons
	Flag: IFlag,
	Summary: ISummary,
	SocialMedia: ISocialMedia[],
	WorkExperience: IWorkExperience[],
}

interface ICommons {
	CurrentLabel: string,
	WorkExperienceSectionLabel: string
	ProjectsSectionLabel: string,
	SkillsLabel: string
}

interface ISummary {	
	greeting: string,
	description: string
}

interface IFlag {
	title: string,
	code: 'ES' | 'US'
	alt: string
}

interface ISocialMedia {
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