import { Info } from "@/common";
import { Translation } from "./Translations.interface";
import { CONST } from '@/helpers'

export const EN: Translation = {
	Commons: {
		CurrentLabel: 'Current',
		ProjectsSectionLabel: 'Projects',
		SkillsLabel: 'Skills',
		WorkExperienceSectionLabel: 'Recent work experience',
	},
	Flag: {
		alt: "Cambiar idioma a Español",
		code: 'ES',
		title: "Cambiar idioma a Español",
	},
	Summary: {
		description: 'Specialized in web development with .NET and JavaScript.',
		grade: 'Software engineer and Full Stack developer ',
		greeting: `Hi!, I'm Juan`,
		location: 'from Nicaragua 🇳🇮. ',
		yearsOfExperience: `+${Info.yearsOfExperience} years of experience. `,
	},
	SocialMedia: [
		{ title: 'LinkedIn profile', icon:null, link: `${CONST.linkedin}?locale=en_US` },
		{ title: 'GitHub repository', icon: null, link: CONST.github },
		{ title: 'Get in touch!', icon: null, link: `mailto:gb.jc@outlook.com` },
	],
	WorkExperience: [
		{
			positionName: 'Senior .NET Developer',
			companyName: 'The Stepstone Group',
			startDate: 'Jan 2022',
			isCurrent: true,
			summary: `
				Build user interfaces with React.js and TypeScript as front-end developer, also implement microservices with 
				.NET Core and NestJS technologies for the differentes brands of the company as back-end developer. Create new feature and 
				support to differents site in Central America.

				Currently I'm working with multi-cultural co-workers from: England, Poland, Irish and Central American.
			`,
			tags: [ 'C#', 'ASP MVC', 'AWS', 'React', 'NestJS', 'SQL', 'JS' ]
		},
		{
			positionName: '.NET Developer',
			companyName: 'Axxis Systems',
			startDate: 'Jun 2020',
			endDate: 'Dec 2021',
			isCurrent: false,
			summary: `
			Build and implement scalable solutions for the insurance sector, using .NET techologies in the back-end and Ext.Js in the front-end.
			I supported to create new feautes for differents companies in differents countries. 
			`,
			tags: [ 'C#', 'ASP MVC API', 'SQL', 'Ext.js' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'INIFOM',
			startDate: 'Apr 2017',
			endDate: 'Jun 2020',
			isCurrent: false,
			summary: `
				I built web application for all Town Halls in the country using .NET technologies. As team lead, I implemented TFS as version 
				control system for all applications and also my responsability were the maintenance of server such like: IIS, database and reporting
				services. I migrated the application from .NET Framework to .NET Core and use Angular.js.
			`,
			tags: [ 'VB.NET', 'C#', 'ASP.NET', '.NET Core', 'SQL', 'IIS' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'Office of Attorney General',
			startDate: 'Mar 2014',
			endDate: 'Apr 2017',
			isCurrent: false,
			summary: `
			Development of the cadastral system for all hall towns (153) of the country. I was the responsable of migration of taxpayers 
			from cadastre system (SISCAT) to financial system (SIAFI) in all hall towns of the country. Created link up between 
			cadastral system (SISCAT/INIFOM) and physical cadastre system (SISCAF/INETER).
			`,
			tags: [ 'VB.NET', 'WinForm', 'C#', 'SQL' ]
		},
		{
			positionName: 'Software Developer',
			companyName: 'Town Hall',
			startDate: 'Jan 2013',
			endDate: 'Mar 2014',
			isCurrent: false,
			summary: `
			I built and implement the Plannification Software and Project Management Software for the Town Hall with ASP MVC and Oracle as database manager`,
			tags: [ 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		},
		{
			positionName: 'Software Analyst and Developer',
			companyName: 'FIX',
			startDate: 'Aug 2012',
			endDate: 'Jan 2013',
			isCurrent: false,
			summary: `
			Support and fix bugs to Sales Software of the company and I collaborated in the develop of ADAPTA system.
			`,
			tags: [ 'ASP.NET', 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		},
		{
			positionName: 'Inter developer',
			companyName: 'ES Consultores',
			startDate: 'Jan 2010',
			endDate: 'Aug 2010',
			isCurrent: false,
			summary: `
			As inter, my responsabilites were give support and add small feactures for the all systems buit with Oracle Forms and a Oracle Reports,
			both in the 6i version.
			`,
			tags: [ 'Oracle Forms', 'Oracle Reports', 'Oracle DB' ]
		},
	]
}