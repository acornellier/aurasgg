import 'pages/app.sass'
import 'instantsearch.css/themes/reset.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { CssBaseline } from '@material-ui/core'
import { useAnalytics } from 'hooks/useAnalytics'
import ThemeProvider from 'components/ThemeProvider'

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  useAnalytics()

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
