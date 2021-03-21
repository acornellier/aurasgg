import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { RefinementList } from 'react-instantsearch-dom'
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

const SearchDrawer = () => {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const drawer = (
    <Container className={classes.drawerContainer}>
      <Toolbar />
      <h2>Type</h2>
      <RefinementList attribute='type' />
      <h2>Category</h2>
      <RefinementList attribute='categories' />
    </Container>
  )

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
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <Drawer
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant='permanent'
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </>
  )
}

export default SearchDrawer
