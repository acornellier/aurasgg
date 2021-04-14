import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Visibility as VisibilityIcon } from '@material-ui/icons'
import { GalleryItem } from 'components/GalleryItem'
import React, { useState } from 'react'
import { useSelectedAura } from 'components/Search/SelectedAuraProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionArea: {
      cursor: 'pointer',
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
    categories: {
      display: 'flex',
      gap: theme.spacing(0.5),
      flexWrap: 'wrap',
    },
    category: {
      cursor: 'inherit',
      borderRadius: 0,
    },
  }),
)

const Hit = ({ hit: aura }: { hit: Aura.SearchAura }) => {
  const classes = useStyles()

  const [selectedAura, setSelectedAura] = useSelectedAura()

  const selectAura = () => {
    setSelectedAura?.(aura)
  }

  const [expandedCategories, setExpandedCategories] = useState(false)

  const preview = aura.gallery.find((media) => media.type === 'screen')

  const categories = expandedCategories
    ? aura.categoryNames
    : aura.categoryNames.slice(0, 5)

  return (
    <Card>
      <CardActionArea className={classes.actionArea} onClick={selectAura}>
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
          <div>Modified {new Date(aura.epochModified).toDateString()}</div>
          <div className={classes.bottom}>
            <div className={classes.categories}>
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
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default Hit
