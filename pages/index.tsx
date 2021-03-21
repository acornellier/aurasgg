import searchClient from 'utils/searchClient'
import {
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import HitComponent from 'components/HitComponent'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
  }),
)

const IndexPage = () => {
  const classes = useStyles()
  console.log(classes.root)

  return (
    <InstantSearch indexName='auras' searchClient={searchClient}>
      <div className={classes.root}>
        <div className='left-panel'>
          <h1>Wowtail</h1>
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
      </div>
    </InstantSearch>
  )
}

export default IndexPage
