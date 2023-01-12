import { ITranslations } from '@translations/index';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SOCIAL_NETWORKS } from '@helpers/index';

export const enTranslation: ITranslations = {
	flag: {
		title: 'Go to spanish version',
		url: './assets/svg/flags/es.svg'
	},
	language: 'en',
	menu: [
		{ label: 'About', title: 'About me', 'url': '/'},
		{ label: 'Experience', title: 'My work experience', 'url': 'experience'},
		{ label: 'My Skills', title: 'My skills', 'url': 'skills'},
		{ label: 'Contact', title: 'Contact me', 'url': 'contact'}
	],
	modeThene: {
		title: ''
	},
	socialNetworks: [
		{ label: 'Go to Linkedin profile....', icon: LinkedInIcon, url: SOCIAL_NETWORKS.linkedin },
		{ label: 'Go to GitHub profile....', icon: GitHubIcon, url: SOCIAL_NETWORKS.github },
		{ label: 'Go to Twitter profile...', icon: TwitterIcon, url: SOCIAL_NETWORKS.twitter },
	]
}