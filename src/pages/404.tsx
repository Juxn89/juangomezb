import { NextPage } from 'next'
import { MainLayout } from '@components/layouts'

const NotFoundPage: NextPage = () => {
  return (
    <MainLayout>
      <h1>Page not found</h1>
    </MainLayout>
  )
}

export default NotFoundPage