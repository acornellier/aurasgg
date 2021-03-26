import { createStyles, makeStyles, Theme } from '@material-ui/core'
import InfiniteHits from 'components/InfiniteHits'
import SearchDrawer from 'components/SearchDrawer'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const SearchPage = () => {
  const classes = useStyles()

  return (
    <>
      <SearchDrawer />
      <InfiniteHits />
    </>
  )
}

export default SearchPage
