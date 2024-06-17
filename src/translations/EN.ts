import { FilePdfOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { Info } from '@/common';
import { CONST } from '@/helpers'
import { Translation } from '@/translations';
import { SpainFlagIcon } from '@/components/ui/Icons';

export const EN: Translation = {
	Commons: {
		CurrentLabel: 'Current',
		OpenToWorkLabel: 'Open to work',
		ProjectsSectionLabel: 'Projects',
		SkillsLabel: 'Skills',
		WorkExperienceSectionLabel: 'Recent work experience',
	},
	Flag: {
		alt: 'Versión en Español',
		code: 'ES',
		flag: SpainFlagIcon,
		title: 'Versión en Español',
		url: '/es'
	},
	Summary: {
		description: 'Specialized in web development with .NET and JavaScript.',
		grade: 'Software engineer and Full Stack developer ',
		greeting: `Hi!, I'm Juan`,
		location: 'from Nicaragua 🇳🇮. ',
		yearsOfExperience: `+${Info.yearsOfExperience} years of experience. `,
	},
	SocialMedia: [
		{ label: 'LinkedIn', title: 'LinkedIn profile', icon: LinkedinOutlined, link: `${CONST.linkedin}?locale=en_US` },
		{ label: 'GitHub', title: 'GitHub repository', icon: GithubOutlined, link: CONST.github },
		{ label: 'Reach out me', title: 'Reach out me', icon: MailOutlined, link: `mailto:gb.jc@outlook.com` },
		{ label: 'Download CV', title: 'Download CV', icon: FilePdfOutlined, link: `${ CONST.baseURL_cv }EN.pdf`, style: 'p-1 bg-yellow-950 text-yellow-50 rounded-2xl text-lg w-40 min-w-40 min-h-9 h-9', download: true },
	],
	WorkExperience: [
		{
			positionName: 'Senior .NET Developer',
			companyName: 'The Stepstone Group',
			startDate: 'Jan 2022',
			isCurrent: true,
			summary: `
				Build user interfaces with React.js and TypeScript as a front-end developer, and implement microservices with .NET Core and NestJS technologies 
				for the different brands of the company as a back-end developer. Create new features and provide support to different sites in Central America.

				Currently, I'm working with multicultural co-workers from England, Poland, Ireland, and Central America.
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
				Build and implement scalable solutions for the insurance sector, using .NET technologies in the back-end and Ext.Js in the front-end. 
				I supported the creation of new features for different companies in different countries.
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
				I built a web application for all Town Halls in the country using .NET technologies. As a team lead, I implemented TFS as the version control 
				system for all applications, and my responsibilities included the maintenance of servers such as IIS, databases, and reporting services. 
				I migrated the application from .NET Framework to .NET Core and used Angular.js.
			`,
			tags: [ 'VB.NET', 'C#', 'ASP.NET', '.NET Core', 'SQL', 'IIS' ]
		},

		// {
		// 	positionName: 'Software Developer',
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
			image: "",
			description: "",
			respository: "",
			demo: ""
		}
	]
}