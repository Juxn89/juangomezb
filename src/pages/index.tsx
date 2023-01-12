import { useEffect } from 'react';
import { NextPage } from 'next';
import {MainLayout} from '@components/layouts';
import { AboutConntent } from '@components/about';
import { useTranslationsLabels } from '../hooks/useTranslationsLabels';

const Home: NextPage = ({ locale }) => {
  const labels = useTranslationsLabels('es')

  useEffect(() => {
    console.log(`Locale: ${ locale }`);
  }, [])
  
  return (
    <MainLayout>
      <div>{ labels.language }</div>
      <div>{ `locale: ${ locale  }` }</div>
      <AboutConntent />
    </MainLayout>
  )
}

export default Home;
