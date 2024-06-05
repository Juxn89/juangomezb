import { LanguagesEnum, LanguagesType } from "@/common";
import { EN, ES, Translation } from "@/translations";

export const useTranslations = (lang: LanguagesType = LanguagesEnum.en): Translation => {
	if(lang === LanguagesEnum.en) return EN;
	if(lang === LanguagesEnum.es) return ES;

	return EN;
}