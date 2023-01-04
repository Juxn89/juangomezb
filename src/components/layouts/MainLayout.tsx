import { FC } from 'react';
import { Grid } from '@mui/material';
import { Menu } from '@components/ui/index';
import Head from 'next/head';
import { Navbar } from '@components/ui';

interface IMainLayoutProps {
  children: JSX.Element | JSX.Element[]
}

export const MainLayout: FC<IMainLayoutProps> = ({children}) => {
  return (
    <>
      <Head>
        <title>Juan G&oacute;mez</title>
        <meta name='description' content='Juan Gómez portafolio' />
        <meta name='' content='' />
        <meta name='og:title' content='Juan Gómez portafolio' />
        <meta name='og:description' content='Juan Gómez portafolio' />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <nav>
        <Navbar />
      </nav>

      <main style={{ marginTop: '80px' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', height: 'calc(100vh - 80px)' }} >
            <Menu />
          </Grid>
          <Grid item xs={12} sm={10}>
            { children }
          </Grid>
        </Grid>
      </main>
    </>
  )
}