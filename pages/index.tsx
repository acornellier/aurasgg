import Layout from 'components/Layout'
import searchClient from 'utils/searchClient'
import {
  ClearRefinements,
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch-dom'

const HitComponent = ({ hit }: { hit: any }) => (
  <div>
    {hit.screens.length > 0 && (
      <img
        src={hit.screens[0]}
        alt={hit.name}
        align='left'
        width={100}
        height={50}
      />
    )}
    <div className='hit-name'>
      <Highlight attribute='name' hit={hit} />
    </div>
    <div className='categories'>
      <Highlight attribute='categories' hit={hit} />
    </div>
    <div className='hit-viewCount'>views: {hit.viewCount}</div>
    <a className='url' href={hit.url} target='_blank'>
      {hit.url}
    </a>
  </div>
)

const IndexPage = () => (
  <Layout>
    <InstantSearch indexName='auras' searchClient={searchClient}>
      <div className='left-panel'>
        <ClearRefinements />
        <h2>Type</h2>
        <RefinementList attribute='type' />
        <Configure hitsPerPage={8} />
        <h2>Category</h2>
        <RefinementList attribute='categories' />
        <Configure hitsPerPage={8} />
      </div>
      <div className='right-panel'>
        <SearchBox />
        <Hits hitComponent={HitComponent} />
        <Pagination />
      </div>
    </InstantSearch>
  </Layout>
)

export default IndexPage
