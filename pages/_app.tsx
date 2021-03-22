import 'pages/app.sass'
import 'instantsearch.css/themes/reset.css'

import { AppProps } from 'next/app'
import { useCookies } from 'react-cookie'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Container,
  createMuiTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider,
  Toolbar,
} from '@material-ui/core'
import Header from 'components/Header'
import { InstantSearch } from 'react-instantsearch-dom'
import searchClient from 'utils/searchClient'

const THEME_COOKIE = 'theme'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  }),
)

const App = ({ Component, pageProps }: AppProps) => {
  const classes = useStyles()

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
        <InstantSearch indexName='auras' searchClient={searchClient}>
          <CssBaseline />
          <Header toggleTheme={toggleTheme} />
          <Toolbar />
          <Container className={classes.main} component='main'>
            <Component {...pageProps} />
          </Container>
        </InstantSearch>
      </ThemeProvider>
    </>
  )
}

export default App
