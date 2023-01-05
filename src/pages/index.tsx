import { NextPage } from 'next';
import {MainLayout} from '@components/layouts';
import { AboutConntent } from '@components/about';

const Home: NextPage = () => {
  return (
    <MainLayout>
      <AboutConntent />
    </MainLayout>
  )
}

export default Home;
