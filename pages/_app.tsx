import 'pages/app.sass'
import 'instantsearch.css/themes/reset.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { Container, CssBaseline, Toolbar } from '@material-ui/core'
import { useAnalytics } from 'hooks/useAnalytics'
import ThemeProvider from 'components/ThemeProvider'
import { InstantSearch } from 'react-instantsearch-dom'
import searchClient from 'utils/searchClient'
import { createURL, useSearchState } from 'hooks/useSearchState'
import Header from 'components/Header'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

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

  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  useAnalytics()

  const [searchState, onSearchStateChange] = useSearchState()

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <ThemeProvider>
        <CssBaseline />
        <InstantSearch
          indexName='auras'
          searchClient={searchClient}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
        >
          <Header />
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
