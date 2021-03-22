import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { GetServerSideProps } from 'next'
import { Client, query as q } from 'faunadb'
import { Aura } from 'interfaces'
import { Typography } from '@material-ui/core'
import { useMemo } from 'react'
import XBBCode from 'utils/xbbcode'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

interface Props {
  aura: Aura
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('getServerSideProps')
  const faunaClient = new Client({ secret: process.env.FAUNA_SECRET! })

  const res = await faunaClient.query<{ data: Aura }>(
    q.Get(q.Match(q.Index('auras_by_slug'), context.params!.slug)),
  )
  return {
    props: {
      aura: res.data,
    },
  }
}
