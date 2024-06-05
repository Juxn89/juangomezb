import { CONST } from '@/helpers';
import { Translation } from '@/translations';
import { Info } from '@/common';
import { FilePdfOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

export const ES: Translation = {
	Commons: {
		CurrentLabel: 'Actualmente',
		ProjectsSectionLabel: 'Proyectos',
		SkillsLabel: 'Habilidadtes',
		WorkExperienceSectionLabel: 'Experiencia más reciente',
	},
	Flag: {
		alt: 'English version',
		code: 'US',
		title: 'English version',
	},
	Summary: {
		description: `Especializado en desarrollo web con .NET y JavaScript`,
		grade: 'Ingenieron de software y desarrollador Full Stack. ',
		greeting: 'Hola!, Soy Juan',
		location: 'de Nicaragua 🇳🇮',
		yearsOfExperience: `+${Info.yearsOfExperience} años de experiencia. `,
	},
	SocialMedia: [
		{ label: 'LinkedIn', title: 'Perfil de LinkedIn', icon: LinkedinOutlined, link: `${CONST.linkedin}?locale=en_US` },
		{ label: 'GitHub', title: 'Repositorio en GitHub', icon: GithubOutlined, link: CONST.github },
		{ label: 'Contáctame', title: 'Contáctame', icon: MailOutlined, link: `mailto:gb.jc@outlook.com` },
		{ label: 'Descargar CV', title: 'Descargar CV', icon: FilePdfOutlined, link: ``, style: '' },
	],
	WorkExperience: [
		{
			positionName: 'Desarrollador Senior .NET',
			companyName: 'The Stepstone Group',
			startDate: 'Ene 2022',
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
			positionName: 'Desarrollador .NET',
			companyName: 'Axxis Systems',
			startDate: 'Jun 2020',
			endDate: 'Dic 2021',
			isCurrent: false,
			summary: `
			Build and implement scalable solutions for the insurance sector, using .NET techologies in the back-end and Ext.Js in the front-end.
			I supported to create new feautes for differents companies in differents countries. 
			`,
			tags: [ 'C#', 'ASP MVC API', 'SQL', 'Ext.js' ]
		},
		{
			positionName: 'Desarrollador de Software',
			companyName: 'INIFOM',
			startDate: 'Abr 2017',
			endDate: 'Jun 2020',
			isCurrent: false,
			summary: `
				I built web application for all Town Halls in the country using .NET technologies. As team lead, I implemented TFS as version 
				control system for all applications and also my responsability were the maintenance of server such like: IIS, database and reporting
				services. I migrated the application from .NET Framework to .NET Core and use Angular.js.
			`,
			tags: [ 'VB.NET', 'C#', 'ASP.NET', '.NET Core', 'SQL', 'IIS' ]
		},

		// {
		// 	positionName: 'Desarrollador de Software',
		// 	companyName: 'Office of Attorney General',
		// 	startDate: 'Mar 2014',
		// 	endDate: 'Apr 2017',
		// 	isCurrent: false,
		// 	summary: `
		// 	Development of the cadastral system for all hall towns (153) of the country. I was the responsable of migration of taxpayers 
		// 	from cadastre system (SISCAT) to financial system (SIAFI) in all hall towns of the country. Created link up between 
		// 	cadastral system (SISCAT/INIFOM) and physical cadastre system (SISCAF/INETER).
		// 	`,
		// 	tags: [ 'VB.NET', 'WinForm', 'C#', 'SQL' ]
		// },
		// {
		// 	positionName: 'Software Developer',
		// 	companyName: 'Town Hall',
		// 	startDate: 'Jan 2013',
		// 	endDate: 'Mar 2014',
		// 	isCurrent: false,
		// 	summary: `
		// 	I built and implement the Plannification Software and Project Management Software for the Town Hall with ASP MVC and Oracle as database manager`,
		// 	tags: [ 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		// },
		// {
		// 	positionName: 'Software Analyst and Developer',
		// 	companyName: 'FIX',
		// 	startDate: 'Aug 2012',
		// 	endDate: 'Jan 2013',
		// 	isCurrent: false,
		// 	summary: `
		// 	Support and fix bugs to Sales Software of the company and I collaborated in the develop of ADAPTA system.
		// 	`,
		// 	tags: [ 'ASP.NET', 'ASP MVC', 'C#', 'Oracle', 'Knockout.js', 'IIS', 'JS' ]
		// },
		// {
		// 	positionName: 'Inter developer',
		// 	companyName: 'ES Consultores',
		// 	startDate: 'Jan 2010',
		// 	endDate: 'Aug 2010',
		// 	isCurrent: false,
		// 	summary: `
		// 	As inter, my responsabilites were give support and add small feactures for the all systems buit with Oracle Forms and a Oracle Reports,
		// 	both in the 6i version.
		// 	`,
		// 	tags: [ 'Oracle Forms', 'Oracle Reports', 'Oracle DB' ]
		// },
	],
	Projects: [
		{
			image: '',
			description: '',
			respository: '',
			demo: ''
		}
	]
}