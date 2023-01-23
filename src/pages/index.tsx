import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {MainLayout} from '@components/layouts';
import { AboutConntent } from '@components/about';
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/index';

const Home: NextPage = () => {
  const { locale } = useRouter()
  const labels = useTranslationsLabels(locale as LanguageType)
  
  return (
    <>
      <MainLayout>
        <AboutConntent />
      </MainLayout>    
    </>

  )
}

export default Home;
