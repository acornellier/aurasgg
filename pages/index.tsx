import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const IndexPage = () => {
  const classes = useStyles()

  return <div>Welcome to auras.gg</div>
}

export default IndexPage
