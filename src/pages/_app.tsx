import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { BaseApplication } from '@pages/_base';
import { store } from '@store/index'
import '@styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={ store }>
      <BaseApplication 
        pageProps={pageProps} 
        Component={Component}
      />
    </Provider>

  )
}
