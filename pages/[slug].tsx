import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { GetServerSideProps } from 'next'
import { Typography } from '@material-ui/core'
import { useMemo } from 'react'
import XBBCode from 'utils/xbbcode'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

interface Props {
  aura: Aura.Wago
}

const AuraPage = ({ aura }: Props) => {
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
      {aura.screens.length > 0 && <img src={aura.screens[0].src} />}
      <div
        className={'bbcode'}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}

export default AuraPage

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  // TODO
  return {
    props: {
      aura: {} as any,
    },
  }
}
