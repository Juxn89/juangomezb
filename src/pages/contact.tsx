import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { MainLayout } from '@components/layouts'

const contact: NextPage = () => {
  const { locale, locales } = useRouter()
  return (
    <MainLayout>
        <h1>contact</h1>
    </MainLayout>
  )
}

export default contact