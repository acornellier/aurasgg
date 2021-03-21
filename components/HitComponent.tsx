import { Aura } from 'interfaces'
import { Card, CardContent, Link } from '@material-ui/core'
import NextLink from 'next/link'
import { Highlight } from 'react-instantsearch-dom'

const HitComponent = ({ hit }: { hit: Aura }) => (
  <Card>
    <CardContent>
      {hit.screens.length > 0 && (
        <img src={hit.screens[0]} alt={hit.name} width={100} height={50} />
      )}
      <NextLink href={`/aura/${hit.slug}`}>
        <a className='name'>{hit.name}</a>
      </NextLink>
      <div className='categories'>
        <Highlight attribute='categories' hit={hit} />
      </div>
      <div className='hit-viewCount'>views: {hit.viewCount}</div>
      <a className='url' href={hit.url} target='_blank'>
        {hit.url}
      </a>
    </CardContent>
  </Card>
)

export default HitComponent
