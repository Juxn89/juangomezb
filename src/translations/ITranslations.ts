import { LanguageType } from "@common/index"
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface ITranslations {
	flag: IFlagTranslation,
	language: LanguageType,
	menu: IMenuTranslations[],
	socialNetworks: ISocialNetworksTranslations[],
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