import InfiniteHits from 'components/InfiniteHits'
import SearchDrawer from 'components/SearchDrawer'
import React from 'react'
import Layout from 'components/Layout'

const SearchPage = () => {
  return (
    <Layout>
      <SearchDrawer />
      <InfiniteHits />
    </Layout>
  )
}

export default SearchPage
