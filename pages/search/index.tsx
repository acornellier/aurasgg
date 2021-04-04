import InfiniteHits from 'components/InfiniteHits'
import SearchDrawer from 'components/SearchDrawer'
import React from 'react'
import Layout from 'components/Layout'

const SearchPage = () => {
  return (
    <Layout title='Search'>
      <SearchDrawer />
      <InfiniteHits />
    </Layout>
  )
}

export default SearchPage

export async function getServerSideProps() {
  return { props: {} }
}
