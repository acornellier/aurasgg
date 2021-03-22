import { createStyles, makeStyles, Theme } from '@material-ui/core'
import InfiniteHits from 'components/InfiniteHits'
import SearchDrawer from 'components/SearchDrawer'
import React from 'react'
import SearchPage from 'pages/search'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const IndexPage = () => {
  const classes = useStyles()

  return <SearchPage />
}

export default IndexPage
