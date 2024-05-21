import { EN, ES, Translation } from '@/translations'

type LanguagesType = {
	currentLocale: string | undefined
}

export const LANGUAGES = {
	ENGLISH: 'en',
	SPANISH: 'es'
}

export const getI18N = ({
  currentLocale = 'en'
}: LanguagesType): Translation => {
  if (currentLocale === LANGUAGES.ENGLISH) return EN
  if (currentLocale === LANGUAGES.SPANISH) return ES
	
  return EN
}