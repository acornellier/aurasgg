import React, { useEffect } from 'react'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import Hit from './Hit'
import { InfiniteHitsProvided } from 'react-instantsearch-core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'
import { useInView } from 'react-intersection-observer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: 'flex',
      flexDirection: 'column',
    },
    loader: {
      alignSelf: 'center',
      margin: theme.spacing(2),
    },
    grid: {
      display: 'grid',
      gridGap: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr',
      },
    },
  }),
)

const InfiniteHits = ({
  hits,
  hasMore,
  refineNext,
}: InfiniteHitsProvided<Aura.SearchAura>) => {
  const classes = useStyles()

  const [ref, inView] = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView) refineNext()
  }, [inView, refineNext])

  return (
    <div className={classes.list}>
      <div className={classes.grid}>
        {hits.map((hit) => (
          <Hit key={hit.id} hit={hit} />
        ))}
      </div>
      {hasMore && (
        <CircularProgress
          ref={ref}
          className={classes.loader}
          color='secondary'
        />
      )}
    </div>
  )
}

export default connectInfiniteHits(InfiniteHits)
