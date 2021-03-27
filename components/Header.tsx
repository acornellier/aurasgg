import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  AppBar,
  Button,
  fade,
  Hidden,
  IconButton,
  Toolbar,
} from '@material-ui/core'
import React from 'react'
import {
  Brightness7 as Brightness7Icon,
  Search as SearchIcon,
  Widgets as WidgetsIcon,
} from '@material-ui/icons'
import NextLink from 'next/link'
import SearchBox from 'components/SearchBox'
import { useToggleTheme } from 'components/ThemeProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      justifyContent: 'space-between',
    },
    button: {
      margin: theme.spacing(1),
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
)

const Header = () => {
  const classes = useStyles()

  const toggleTheme = useToggleTheme()

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <NextLink href='/'>
          <Button
            className={classes.button}
            startIcon={<WidgetsIcon />}
            color='inherit'
            size='large'
          >
            <Hidden xsDown>auras.gg</Hidden>
          </Button>
        </NextLink>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <SearchBox />
        </div>
        <IconButton onClick={toggleTheme}>
          <Brightness7Icon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
