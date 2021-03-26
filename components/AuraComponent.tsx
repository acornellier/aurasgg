import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import React, { useMemo } from 'react'
import XBBCode from 'utils/xbbcode'
import { GalleryItem } from 'components/GalleryItem'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

interface Props {
  aura: Aura.Aura
}

export const AuraComponent = ({ aura }: Props) => {
  const classes = useStyles()

  const description = useMemo(() => {
    return XBBCode.process({
      text: aura.description.text,
      removeMisalignedTags: true,
      addInLineBreaks: true,
      enableURLs: true,
    }).html
  }, [aura])

  return (
    <div>
      <Typography variant='h6'>{aura.name}</Typography>
      {aura.gallery.map((media) => (
        <GalleryItem key={media.src} media={media} />
      ))}
      <div
        className='bbcode'
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}

export default AuraComponent
