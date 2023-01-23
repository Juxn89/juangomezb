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

        <link rel='alternate' hrefLang='x-default' href='httsp://www.juangomezb.com/'/>
        <link rel='alternate' hrefLang='en' href='httsp://www.juangomezb.com/'/>
        <link rel='alternate' hrefLang='es' href='httsp://www.juangomezb.com/es'/>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        { /* Personal information  */ }
        <meta name='description' content="Juan Gómez's portafolio" />
        <meta name='keywords' content='Juan Gómez, Juan Gomez, Juan, Gómez, Gomez, developer, .NET, .NET Developer, NET Core, C#, react, typescript, javascript, nextjs, HTML, CSS' />
        <meta name='author' content='Juan Gómez, gb.jc@outlook.com'/>
        <meta name="url" content="htts://juangomezb.com" />

        { /* OG tags  */ }
        <meta name='og:title' content='Juan Gómez portafolio' />
        <meta name='og:url' content='httsp://www.juangomezb.com/' />
        <meta name='og:description' content='Juan Gómez portafolio' />
        <meta name="twitter:card" content="summary" />

        { /* Google's robots  */ }
        <meta name="robots" content="index, follow" />
      </Head>

      <nav>
        <Navbar />
      </nav>

      <main>
        <Grid container spacing={1} sx={{ mt: { xs: '30px', sm: '70px' } }}>
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