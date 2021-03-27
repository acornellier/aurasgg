import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import { db } from 'utils/firebase'
import AuraComponent from 'components/AuraComponent'
import Layout from 'components/Layout'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {},
  }),
)

const AuraPage = () => {
  const classes = useStyles()
  const router = useRouter()

  const slug = router.query.slug as string

  const [aura, loading, error] = useDocumentDataOnce<Aura.Aura>(
    db().collection('auras').doc(slug),
  )

  if (loading || !aura) {
    // return <CircularProgress className={classes.loader} color='secondary' />
    return null
  }

  if (error) {
    return <div>Error fetching Aura: {error.message}</div>
  }

  return (
    <Layout>
      <AuraComponent aura={aura} />
    </Layout>
  )
}

export default AuraPage
