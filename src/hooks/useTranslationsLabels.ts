import { LanguageType } from "@common/index";
import { ITRanslations, TranslationLabels } from "@translations/index";

export const useTranslationsLabels = (locale: LanguageType): ITRanslations => {
	const translations = TranslationLabels[locale];

	return translations;
}