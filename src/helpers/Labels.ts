import { LANGUAGES } from "@/lang";
import { EN, ES } from "@/translations";
import { Translation } from "@/translations/Translations.interface";

export const getLabels = (lang: string): Translation => {
	if(lang === LANGUAGES.ENGLISH) return EN;

	return EN;
}