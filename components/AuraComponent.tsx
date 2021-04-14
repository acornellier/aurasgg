import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import React, { useMemo } from 'react'
import XBBCode from 'utils/xbbcode'
import { GalleryItem } from 'components/GalleryItem'
import CopyCode from 'components/CopyCode'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    embed: {
      width: '100%',
      height: '795px',
    },
    gallery: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      overflowY: 'hidden',
    },
    galleryItem: {
      maxWidth: 'fit-content',
    },
  }),
)

interface Props {
  aura: Aura.Aura | Aura.SearchAura
}

export const AuraComponent = ({ aura }: Props) => {
  const classes = useStyles()

  const description = useMemo(() => {
    if (!('description' in aura)) return ''

    return XBBCode.process({
      text: aura.description.text,
      removeMisalignedTags: true,
      addInLineBreaks: true,
      enableURLs: true,
    }).html
  }, [aura])

  return (
    <Container>
      <div className={classes.title}>
        <Typography variant='h6'>{aura.name}</Typography>
        {'code' in aura && <CopyCode code={aura.code} />}
      </div>
      <div className={classes.gallery}>
        {aura.gallery.map((media) => (
          <div key={media.src} className={classes.galleryItem}>
            <GalleryItem media={media} />
          </div>
        ))}
      </div>
      {aura.wago && <a href={aura.wago.url}>Imported from wago.io</a>}
      {aura.type === 'mdt' && (
        <iframe
          src={`https://wago.io/${aura.id}/embed.html`}
          className={classes.embed}
        />
      )}
      <div
        className='bbcode'
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </Container>
  )
}

export default AuraComponent
