import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {MainLayout} from '@components/layouts';
import { AboutConntent } from '@components/about';
import { LANGUAGE_AVAILABLE } from '../../common/constants';

type HomeProps = {
  locale: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { params } = ctx;
  const { lng = 'es' } = params as { lng: string };

  return {
    props: {
      locale: lng
    }
  }
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: LANGUAGE_AVAILABLE.map(lng => ({
      params: { lng } 
    })),
    fallback: "blocking"
  }
}

const Home: NextPage<HomeProps> = ({ locale }) => {
  useEffect(() => {
    console.log(`Locale: ${ locale }`);
  }, [])
  
  return (
    <MainLayout>
      <AboutConntent />
    </MainLayout>
  )
}

export default Home;
