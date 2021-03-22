import { SearchAura } from 'interfaces'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Visibility as VisibilityIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: 0,
      paddingTop: '40%', // 16:9
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    viewCount: {
      display: 'flex',
      alignItems: 'center',
    },
    name: {
      fontSize: 14,
    },
    category: {
      cursor: 'inherit',
    },
  }),
)

const Hit = ({ hit }: { hit: SearchAura }) => {
  const classes = useStyles()

  return (
    <Card>
      <NextLink href={`/aura/${hit.slug}`}>
        <CardActionArea>
          {hit.screens.length > 0 && (
            <CardMedia className={classes.media} image={hit.screens[0]} />
          )}
          <CardContent>
            <div className={classes.title}>
              <Typography variant='h6'>{hit.name}</Typography>
              <div className={classes.viewCount}>
                {hit.viewCount}
                <VisibilityIcon />
              </div>
            </div>
            <div>
              {hit.categories.map((category) => (
                <Chip
                  key={category}
                  className={classes.category}
                  label={category}
                />
              ))}
            </div>
          </CardContent>
        </CardActionArea>
      </NextLink>
    </Card>
  )
}

export default Hit
