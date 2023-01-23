import { LanguageType } from "@common/index"
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface ITranslations {
	common: ICommonLabels,
	flag: IFlagTranslation,
	language: LanguageType,
	menu: IMenuTranslations[],
	cvFile: IcvFile,
	socialNetworks: ISocialNetworksTranslations[],
	about: IAbout,
	workExperience: IWorkExperience[]
}

interface ICommonLabels {
	current: string,
	technologies: string
}

interface IcvFile {
	title: string,
	label: string,
	url: string
}

interface IMenuTranslations {
	label: string,
	title: string,
	url: string,
}

interface ISocialNetworksTranslations {
	label: string,
	url: string,
	icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
}

export interface IFlagTranslation {
	title: string,
	url: string
}

export interface IWorkExperience {
	place: string,
	position: string,
	descriptions: string
	dateStart: string,
	dateEnd?: string,
	isCurrentJob: boolean
	technologies: string[]
}

interface IAbout {
	initialGetting: string,
	subTitle: string,
	description: string,
}