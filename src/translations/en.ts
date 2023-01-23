import { ITranslations } from '@translations/index';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { CV_FILES_BASE_URL, FLAGS_BASE_URL } from '@common/index';
import { SOCIAL_NETWORKS } from '@helpers/index';

export const enTranslation: ITranslations = {
	common: {
		current: 'Current',
		technologies: 'Technologies'
	},
	cvFile: {
		label: 'Download CV (EN)',
		title: `Download CV (EN)`,
		url: `${CV_FILES_BASE_URL}EN.pdf`
	},
	flag: {
		title: 'Go to spanish version',
		url: `${FLAGS_BASE_URL}es.svg`
	},
	language: 'en',
	menu: [
		{ label: 'About', title: 'About me', 'url': '/' },
		{ label: 'Experience', title: 'My work experience', 'url': 'experience' },
		{ label: 'Skills', title: 'My skills', 'url': 'skills' },
		{ label: 'Contact', title: 'Contact me', 'url': 'contact' }
	],
	socialNetworks: [
		{ label: 'Go to Linkedin profile...', icon: LinkedInIcon, url: `${SOCIAL_NETWORKS.linkedin}?locale=en_US` },
		{ label: 'Go to GitHub profile...', icon: GitHubIcon, url: SOCIAL_NETWORKS.github },
		{ label: 'Go to Twitter profile...', icon: TwitterIcon, url: SOCIAL_NETWORKS.twitter },
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
			place: 'Nicaraguan Institute Municipal for Municipal Development',
			descriptions: ``,
			position: 'Software Developer',
			dateStart: '04-2017',
			dateEnd: '06-2020',
			isCurrentJob: false,
			technologies: ['.NET', 'NET Core', 'ASP.Net', 'ASP MVC', 'C#', 'Angular JS', 'VB6.0']
		},
		{
			place: 'Attorney General of the Republic',
			descriptions: `Sofware Developer`,
			position: '.NET Developer',
			dateStart: '01-2014',
			dateEnd: '04-2017',
			isCurrentJob: false,
			technologies: ['.NET', 'WinForms', 'VB .NET', 'Oracle', 'Oracle Forms']
		},
		{
			place: 'Managua\'s Town Hall',
			descriptions: ``,
			position: '.NET Developer',
			dateStart: '02-2013',
			dateEnd: '01-2014',
			isCurrentJob: false,
			technologies: ['.NET', 'ASP MVC', 'JS']
		}
	],
	about: {
		initialGetting: "Hi there 👋! welcome, I'm Juan",
		subTitle: 'Software engineer, .NET & react developer',
		description:
			`
			sdlñfsdñlfjsdlkfjsdlkfjsdlkfjdslkfjdslkf
			askdjaskldaskshfkjsdhgdkjshgfdsdjfkjshdaskjhdas
			lcdsalkdjaslkdaskldjaskldas
			asdasd
			`
	}
}