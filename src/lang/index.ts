import { EN, ES } from '@/translations'

type LanguagesType = {
	currentLocale: string | undefined
}

export const LANGUAGES = {
	ENGLISH: 'EN',
	SPANISH: 'ES'
}

export const getI18N = ({
  currentLocale = 'EN'
}: LanguagesType) => {
  if (currentLocale === LANGUAGES.ENGLISH) return EN
  if (currentLocale === LANGUAGES.SPANISH) return ES
	
  return EN
}