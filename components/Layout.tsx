import React, { ReactNode, useReducer } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, CssBaseline, Toolbar } from '@material-ui/core'
import Header from 'components/Header'
import { InstantSearch } from 'react-instantsearch-dom'
import searchClient from 'utils/searchClient'
import { createURL, useSearchState } from 'hooks/useSearchState'
import Head from 'next/head'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  }),
)

interface Props {
  children: NonNullable<ReactNode>
  title?: string
}

const Layout = ({ children, title }: Props) => {
  const classes = useStyles()

  const [searchState, onSearchStateChange] = useSearchState()

  return (
    <>
      <Head>
        <title>{title || 'auras.gg'}</title>
      </Head>
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
          {children}
        </Container>
      </InstantSearch>
    </>
  )
}

export default Layout
