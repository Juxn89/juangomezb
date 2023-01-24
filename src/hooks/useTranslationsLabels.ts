import { LanguageType } from '@common/index';
import { ITranslations, TranslationLabels } from '@translations/index';

export const useTranslationsLabels = (locale: LanguageType): ITranslations => {
  const translations = TranslationLabels[locale];

  return translations;
}