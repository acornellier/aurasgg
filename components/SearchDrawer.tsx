import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import {
  Menu,
  NumericMenu,
  RefinementList,
  SortBy,
} from 'react-instantsearch-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Toolbar } from '@material-ui/core'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  }),
)

const DrawerContainer = () => {
  const classes = useStyles()

  return (
    <Container className={classes.drawerContainer}>
      <Toolbar />
      <h2>Sort by</h2>
      <SortBy
        items={[
          { value: 'auras/sort/views:desc', label: 'Views' },
          {
            value: 'auras/sort/epochModified:desc',
            label: 'Date modified',
          },
          {
            value: 'auras/sort/epochCreated:desc',
            label: 'Date created',
          },
        ]}
        defaultRefinement='auras'
      />
      <h2>Expansion</h2>
      <NumericMenu
        attribute='epochModified'
        items={[{ label: 'Updated for Shadowlands', start: 1602547200000 }]}
        defaultRefinement='1602547200000:'
      />
      <h2>Type</h2>
      <Menu attribute='type' />
      <h2>Category</h2>
      <RefinementList attribute='categoryNames' />
    </Container>
  )
}

const SearchDrawer = () => {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <>
      <Hidden smUp implementation='css'>
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerContainer />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <Drawer
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant='permanent'
          open
        >
          <DrawerContainer />
        </Drawer>
      </Hidden>
    </>
  )
}

export default SearchDrawer
