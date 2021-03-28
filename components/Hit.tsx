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
import { GalleryItem } from 'components/GalleryItem'
import { useState } from 'react'

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

const Hit = ({ hit }: { hit: Aura.SearchAura }) => {
  const classes = useStyles()

  const [expandedCategories, setExpandedCategories] = useState(false)

  const preview = hit.gallery.find((media) => media.type === 'screen')

  const categories = expandedCategories
    ? hit.categoryNames
    : hit.categoryNames.slice(0, 5)

  return (
    <Card>
      <NextLink href={`/${hit.id}`}>
        <CardActionArea>
          {preview && (
            <CardMedia className={classes.media}>
              <GalleryItem media={preview} />
            </CardMedia>
          )}
          <CardContent>
            <div className={classes.title}>
              <Typography variant='h6'>{hit.name}</Typography>
              <div className={classes.viewCount}>
                {hit.views}
                <VisibilityIcon />
              </div>
            </div>
            <div>
              {categories.map((category: string) => (
                <Chip
                  key={category}
                  className={classes.category}
                  label={category}
                />
              ))}
              {hit.categoryNames.length > 5 && !expandedCategories && (
                <Chip
                  className={classes.category}
                  label='...'
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedCategories(!expandedCategories)
                  }}
                />
              )}
            </div>
          </CardContent>
        </CardActionArea>
      </NextLink>
    </Card>
  )
}

export default Hit
