import { LanguageType } from '@common/index';
import { enTranslation, esTranslation, ITRanslations } from '@translations/index';

interface ITranslationLabels {
	[key: LanguageType]: ITRanslations;
};

export const TranslationLabels: ITranslationLabels = {
  'es': esTranslation,
  'en': enTranslation
}