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
    media: {},
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

const HitMedia = ({ url, name }: { url: string; name: string }) => {
  if (url.includes('.webm')) {
    return <video autoPlay loop src={url} />
  } else {
    return <img src={url} alt={name} width={500} height={200} />
  }
}

const Hit = ({ hit }: { hit: any }) => {
  const classes = useStyles()

  return (
    <Card>
      <NextLink href={`/${hit.slug}`}>
        <CardActionArea>
          {hit.screens.length > 0 && (
            <CardMedia className={classes.media}>
              <HitMedia url={hit.screens[0]} name={hit.name} />
            </CardMedia>
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
              {hit.categories.map((category: string) => (
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
