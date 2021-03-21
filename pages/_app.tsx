import 'pages/app.css'
import 'instantsearch.css/themes/reset.css'

import { AppProps } from 'next/app'
import { CookiesProvider, useCookies } from 'react-cookie'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { createMuiTheme, CssBaseline, ThemeOptions } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import Header from 'components/Header'

const THEME_COOKIE = 'theme'

const App = ({ Component, pageProps }: AppProps) => {
  const [cookies, setCookie] = useCookies([THEME_COOKIE])

  const [theme, setTheme] = useState<ThemeOptions>({
    palette: { type: cookies[THEME_COOKIE] || 'light' },
  })

  const toggleTheme = () => {
    const newTheme = theme.palette?.type === 'light' ? 'dark' : 'light'
    setCookie(THEME_COOKIE, newTheme)
    setTheme({ palette: { type: newTheme } })
  }

  const muiTheme = createMuiTheme(theme)

  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <>
      <Head>
        <title>Wowtail</title>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Header toggleTheme={toggleTheme} />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
