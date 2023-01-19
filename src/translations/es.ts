import { ITranslations } from '@translations/index';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { FLAGS_BASE_URL } from '@common/index';
import { SOCIAL_NETWORKS } from '@helpers/index';

export const esTranslation: ITranslations = {
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
		{ label: 'Go to Linkedin profile....', icon: LinkedInIcon, url: SOCIAL_NETWORKS.linkedin },
		{ label: 'Go to GitHub profile....', icon: GitHubIcon, url: SOCIAL_NETWORKS.github },
		{ label: 'Go to Twitter profile...', icon: TwitterIcon, url: SOCIAL_NETWORKS.twitter },
	]
}