import { LanguagesType } from "@/common";
import { EN, ES, Translation } from "@/translations";

export const useTranslations = (lang: LanguagesType = 'en'): Translation => {
	if(lang === 'en') return EN;
	if(lang === 'es') return ES;

	return EN;
}