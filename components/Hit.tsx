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
import React, { useState } from 'react'
import CopyCode from 'components/CopyCode'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionArea: {
      height: '100%',
    },
    media: {
      display: 'flex',
      justifyContent: 'center',
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
    bottom: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    category: {
      cursor: 'inherit',
    },
  }),
)

const Hit = ({ hit: aura }: { hit: Aura.SearchAura }) => {
  const classes = useStyles()

  const [expandedCategories, setExpandedCategories] = useState(false)

  const preview = aura.gallery.find((media) => media.type === 'screen')

  const categories = expandedCategories
    ? aura.categoryNames
    : aura.categoryNames.slice(0, 5)

  return (
    <Card>
      <NextLink href={`/${aura.id}`}>
        <a>
          <CardActionArea className={classes.actionArea}>
            {preview && (
              <CardMedia className={classes.media}>
                <GalleryItem media={preview} />
              </CardMedia>
            )}
            <CardContent>
              <div className={classes.title}>
                <Typography variant='h6'>{aura.name}</Typography>
                <div className={classes.viewCount}>
                  {aura.views}
                  <VisibilityIcon />
                </div>
              </div>
              <div>{aura.dateModified}</div>
              <div className={classes.bottom}>
                <div>
                  {categories.map((category: string) => (
                    <Chip
                      key={category}
                      className={classes.category}
                      label={category}
                    />
                  ))}
                  {aura.categoryNames.length > 5 && !expandedCategories && (
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
                <CopyCode iconOnly code={aura.code} />
              </div>
            </CardContent>
          </CardActionArea>
        </a>
      </NextLink>
    </Card>
  )
}

export default Hit
