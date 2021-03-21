import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  AppBar,
  Button,
  fade,
  Hidden,
  IconButton,
  InputBase,
  Toolbar,
} from '@material-ui/core'
import React from 'react'
import {
  Brightness7 as Brightness7Icon,
  Search as SearchIcon,
  Widgets as WidgetsIcon,
} from '@material-ui/icons'
import { connectSearchBox, SearchBoxProvided } from 'react-instantsearch-core'
import NextLink from 'next/link'

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
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }),
)

interface Props extends SearchBoxProvided {
  toggleTheme: () => void
}

const Header = ({ toggleTheme, refine, currentRefinement }: Props) => {
  const classes = useStyles()

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
            <Hidden xsDown>Wowtail</Hidden>
          </Button>
        </NextLink>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            value={currentRefinement}
            onChange={(event) => {
              refine(event.target.value)
              window.scrollTo({ top: 0 })
            }}
            placeholder='Search…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <IconButton onClick={toggleTheme}>
          <Brightness7Icon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default connectSearchBox(Header)
