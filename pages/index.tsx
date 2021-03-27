import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import Layout from 'components/Layout'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const IndexPage = () => {
  const classes = useStyles()

  return <Layout>Welcome to auras.gg</Layout>
}

export default IndexPage
