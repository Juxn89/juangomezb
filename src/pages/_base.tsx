import { FC } from 'react'
import { NextComponentType, NextPageContext } from 'next';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme, darkTheme } from '@themes/index';
import { useAppSelector } from '@hooks/index';

interface IBaseApplication {
    Component: NextComponentType<NextPageContext, any, any>,
    pageProps: any
}

export const BaseApplication: FC<IBaseApplication> = ({ Component, pageProps }) => {
  const { isDarkMode } = useAppSelector(state => state.themeMode)
  return (
    <ThemeProvider theme={ isDarkMode ? darkTheme : lightTheme }>
      <CssBaseline>
        <Component {...pageProps} />
      </CssBaseline>      
    </ThemeProvider>
  )
}
