import { Info } from "@/common";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import { Translation } from "./Translations.interface";
import { CONST } from '@/helpers'

export const EN: Translation = {
	Commons: {
		CurrentLabel: 'Current',
		WorkExperienceSectionLabel: 'Experience',
		ProjectsSectionLabel: 'Projects',
		SkillsLabel: 'Skills'
	},
	Flag: {
		title: "Cambiar idioma a Español",
		code: 'ES',
		alt: "Cambiar idioma a Español"
	},
	Summary: {
		greeting: `Hi!, I'm Juan`,
		description:
			`Full Stack developer with ${ Info.yearsOfExperience }+ years of developing and implementing web applications using .NET technologies`
	},
	SocialMedia: [
		{ title: 'LinkedIn profile', icon: LinkedinFilled, link: `${CONST.linkedin}?locale=en_US` },
		{ title: 'GitHub repository', icon: GithubFilled, link: CONST.github },
	],
	WorkExperience: [
		{
			positionName: 'Senior .NET Developer',
			companyName: 'The Stepstone Group',
			startDate: 'Jan 2022',
			isCurrent: true,
			summary: ``,
			tags: [ 'C#', 'ASP MVC', 'AWS', 'React', 'NestJS', 'SQL', 'JS' ]
		},
		{
			positionName: '.NET Developer',
			companyName: 'Axxis Systems',
			startDate: 'Jun 2020',
			endDate: 'Dec 2021',
			isCurrent: false,
			summary: ``,
			tags: [ 'C#', 'ASP MVC API', 'SQL', 'Ext.js' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'INIFOM',
			startDate: 'Apr 2017',
			endDate: 'Jun 2020',
			isCurrent: false,
			summary: ``,
			tags: [ 'VB.NET', 'C#', 'ASP.NET', '.NET Core', 'SQL', 'IIS', 'Angular.js' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'Office of Attorney General',
			startDate: 'Mar 2014',
			endDate: 'Apr 2017',
			isCurrent: false,
			summary: ``,
			tags: [ 'VB.NET', 'WinForm', 'C#', 'SQL' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'Town Hall',
			startDate: 'Jan 2013',
			endDate: 'Mar 2014',
			isCurrent: false,
			summary: ``,
			tags: [ 'ASP.NET', 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		},
		{
			positionName: 'Software Analyst and Developer',
			companyName: 'FIX',
			startDate: 'Aug 2012',
			endDate: 'Jan 2013',
			isCurrent: false,
			summary: ``,
			tags: [ 'ASP.NET', 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		},
		{
			positionName: 'Inter developer',
			companyName: 'ES Consultores',
			startDate: 'Jan 2010',
			endDate: 'Aug 2010',
			isCurrent: false,
			summary: ``,
			tags: [ 'Oracle Forms', 'Oracle Reports', 'Oracle DB' ]
		},
	]
}