import { getI18N } from "@/lang"
import { Translation } from "@/translations/Translations.interface"
import { useParams } from "next/navigation"

export const useTranslations = (): Translation => {
	const { lang } = useParams()

	return getI18N({ currentLocale: lang as string})
}