export interface ITRanslations {
	language: 'es' | 'en',
	menu: IMenuTranslations[],
	socialNetworks: ISocialNetworksTranslations[],
	flag: IFlagTranslation
}

interface IMenuTranslations {
	label: string,
	title: string,
	url: string,
}

interface ISocialNetworksTranslations {
	label: string,
	url: string
}

interface IFlagTranslation {
	title: string,
	url: string
}