import React, { ReactNode } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Head from 'next/head'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  }),
)

interface Props {
  children: NonNullable<ReactNode>
  title?: string
}

const Layout = ({ children, title }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>{title || 'auras.gg'}</title>
      </Head>
      {children}
    </>
  )
}

export default Layout
