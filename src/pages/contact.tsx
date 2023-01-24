import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { MainLayout } from '@components/layouts'
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/index';

const Contact: NextPage = () => {
  const { locale, locales } = useRouter()
  const { common } = useTranslationsLabels(locale as LanguageType)

  return (
    <MainLayout>
      <h1>contact</h1>
    </MainLayout>
  )
}

export default Contact