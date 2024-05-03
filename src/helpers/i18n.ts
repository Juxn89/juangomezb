import { LANGUAGES } from "@/lang";
import { EN, ES } from "@/translations";
import { Translation } from "@/translations/Translations.interface";

export const getI18NLabels = (lang: string = LANGUAGES.ENGLISH): Translation => {
	if(lang === LANGUAGES.ENGLISH) return EN;

	return EN;
}