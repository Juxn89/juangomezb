import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {MainLayout} from '@components/layouts';
import { AboutConntent } from '@components/about';
import { useTranslationsLabels } from '@hooks/index';

const Home: NextPage = () => {
  const { locale } = useRouter()
  const labels = useTranslationsLabels('es')
  
  return (
    <MainLayout>
      <AboutConntent />
    </MainLayout>
  )
}

export default Home;
