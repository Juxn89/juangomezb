import { LanguageType } from "@common/index"

export interface ITRanslations {
	flag: IFlagTranslation,
	language: LanguageType,
	menu: IMenuTranslations[],
	modeThene: IModeTheme
	socialNetworks: ISocialNetworksTranslations[],
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

interface IModeTheme {
	title: string
}