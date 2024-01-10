import { EN, ES } from '@/translations'

type LanguagesType = {
	currentLocale: string | undefined
}

export const LANGUAGES = {
	ENGLISH: 'us',
	SPANISH: 'es'
}

export const getI18N = ({
  currentLocale = 'es'
}: LanguagesType) => {
  if (currentLocale === LANGUAGES.ENGLISH) return EN
  if (currentLocale === LANGUAGES.SPANISH) return ES
  return EN
}