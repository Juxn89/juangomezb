import { ITranslations } from '@translations/index';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { CV_FILES_BASE_URL, FLAGS_BASE_URL } from '@common/index';
import { SOCIAL_NETWORKS } from '@helpers/index';

export const esTranslation: ITranslations = {
	common: {
		current: 'Actual',
		technologies: 'Tecnologías'
	},
	cvFile: {
		label: 'Download CV (ES)',
		title: `Download CV (ES)`,
		url: `${CV_FILES_BASE_URL}ES.pdf`
	},
	flag: {
		title: 'Ir a la versión en inglés',
		url: `${FLAGS_BASE_URL}us.svg`
	},
	language: 'es',
	menu: [
		{ label: 'Sobre mi', title: 'Acerca de mi', 'url': '/'},
		{ label: 'Experiencia', title: 'Mi experiencia laboral', 'url': 'experience'},
		{ label: 'Habilidades', title: 'Mis habilidades', 'url': 'skills'},
		{ label: 'Contacto', title: 'Contacta me', 'url': 'contact'}
	],
	socialNetworks: [
		{ label: 'Ir al perfil de Linkedin...', icon: LinkedInIcon, url: SOCIAL_NETWORKS.linkedin },
		{ label: 'Ir al perfil de GitHub...', icon: GitHubIcon, url: SOCIAL_NETWORKS.github },
		{ label: 'Ir al perfil de Twitter...', icon: TwitterIcon, url: SOCIAL_NETWORKS.twitter },
	],
	workExperience: [
		{ 
			place: 'Stepstone',
			descriptions: ``,
			position: 'Senior .NET Developer',
			dateStart: '01-2022',
			isCurrentJob: true,
			technologies: ['.NET', 'NET Core', 'C#', 'JS', 'React', 'Nest JS']
		},
		{ 
			place: 'Axxis Systems',
			descriptions: ``,
			position: 'Senior .NET Developer',
			dateStart: '06-2020',
			dateEnd: '12-2021',
			isCurrentJob: false,
			technologies: ['.NET', 'C#', 'JS', 'ExtJS']
		},
		{
			place: 'Instituto Nicaragüense de Fomento Municipal',
			descriptions: ``,
			position: 'Desarrollador de Sistemas',
			dateStart: '04-2017',
			dateEnd: '06-2020',
			isCurrentJob: false,
			technologies: ['.NET', 'NET Core', 'ASP.Net', 'ASP MVC', 'C#', 'Angular JS', 'VB6.0']
		},
		{
			place: 'Procuradoría General de la República',
			descriptions: `Sofware Developer`,
			position: '.NET Developer',
			dateStart: '01-2014',
			dateEnd: '04-2017',
			isCurrentJob: false,
			technologies: ['.NET', 'WinForms', 'VB .NET', 'Oracle', 'Oracle Forms']
		},		
		{
			place: 'Alcaldía de Managua',
			descriptions: ``,
			position: '.NET Developer',
			dateStart: '02-2013',
			dateEnd: '01-2014',
			isCurrentJob: false,
			technologies: ['.NET', 'ASP MVC', 'JS']
		}
	],
	about: {
		initialGetting: "Hola 👋! Bienvenido, Soy Juan",
		subTitle: '',
		description: ''
	}
}