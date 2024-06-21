import { FilePdfOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { Info } from '@/common';
import { CONST } from '@/helpers';
import { Translation } from '@/translations';
import { UnitedStateFlagIcon } from '@/components/ui/Icons';

export const ES: Translation = {
	Commons: {
		TitleMetadata: `Juan Gómez's portfolio - Full Stack Web Developer and programmer with +${Info.yearsOfExperience} years of experience`,
		CurrentLabel: 'Actualmente',
		OpenToWorkLabel: 'Disponible para trabajar',
		ProjectsSectionLabel: 'Proyectos',
		SkillsLabel: 'Habilidadtes',
		WorkExperienceSectionLabel: 'Experiencia más reciente',
	},
	Flag: {
		alt: 'English version',
		code: 'US',
		flag: UnitedStateFlagIcon,
		title: 'English version',
		url: '/en'
	},
	Summary: {
		description: `Especializado en desarrollo web con .NET y JavaScript`,
		grade: 'Ingeniero de software y desarrollador Full Stack. ',
		greeting: 'Hola!, Soy Juan',
		location: 'de Nicaragua 🇳🇮. ',
		yearsOfExperience: `+${Info.yearsOfExperience} años de experiencia. `,
	},
	SocialMedia: [
		{ label: 'LinkedIn', title: 'Perfil de LinkedIn', icon: LinkedinOutlined, link: `${CONST.linkedin}?locale=en_US` },
		{ label: 'GitHub', title: 'Repositorio en GitHub', icon: GithubOutlined, link: CONST.github },
		{ label: 'Contáctame', title: 'Contáctame', icon: MailOutlined, link: `mailto:gb.jc@outlook.com` },
		{ label: 'Descargar CV', title: 'Descargar CV', icon: FilePdfOutlined, link: `${ CONST.baseURL_cv }ES.pdf` }, 
	],
	WorkExperience: [
		{
			positionName: 'Desarrollador Senior .NET',
			companyName: 'The Stepstone Group',
			startDate: 'Ene 2022',
			isCurrent: true,
			summary: `
				Construir interfaces de usuario con React.js y TypeScript como desarrollador front-end, e implementar microservicios con tecnologías .NET Core y NestJS para las diferentes marcas de la empresa como desarrollador back-end. Crear nuevas funcionalidades y proporcionar soporte a diferentes sitios en Centroamérica.

				Actualmente, estoy trabajando con compañeros de trabajo multiculturales de Inglaterra, Polonia, Irlanda y Centroamérica.
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
				Construir e implementar soluciones escalables para el sector de seguros, utilizando tecnologías .NET en el back-end y Ext.Js en el front-end. 
				Apoyé la creación de nuevas funcionalidades para diferentes empresas en distintos países.
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
				Construí una aplicación web para todos los Ayuntamientos del país utilizando tecnologías .NET. Como líder de equipo, implementé TFS como el 
				sistema de control de versiones para todas las aplicaciones, y mis responsabilidades incluían el mantenimiento de servidores como IIS, bases de datos y 
				servicios de informes. Migré la aplicación de .NET Framework a .NET Core y utilicé Angular.js.
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