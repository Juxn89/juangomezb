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
        { /* Personal information  */ }
        <title>Juan G&oacute;mez</title>
        <meta name='description' content='Juan Gómez portafolio' />
        <meta name='keywords' content='Juan Gómez, Juan Gomez, Juan, Gómez, Gomez, developer, .NET, .NET Developer, NET Core, C#, react, typescript, javascript, nextjs, HTML, CSS' />
        <meta name='author' content='Juan Gómez, gb.jc@outlook.com'/>
        <meta name="url" content="htts://juangomezb.com" />

        { /* OG tags  */ }
        <meta name='og:title' content='Juan Gómez portafolio' />
        <meta name='og:description' content='Juan Gómez portafolio' />
        <meta name="twitter:card" content="summary" />

        { /* Google's robots  */ }
        <meta name="robots" content="index, follow" />
      </Head>

      <nav>
        <Navbar />
      </nav>

      <main style={{ marginTop: '80px' }}>
        <Grid container spacing={1}>
          <Grid item 
            xs={12} 
            sm={2}
            md={2}
            xl={2}
            sx={{ 
              display: 'flex',
              alignItems: 'center', 
              // height: { xs: '40px', sm: 'calc(100vh - 80px)' }
            }}
          >
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