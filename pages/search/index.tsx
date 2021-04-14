import InfiniteHits from 'components/Search/InfiniteHits'
import SearchDrawer from 'components/Search/SearchDrawer'
import React from 'react'
import Layout from 'components/Layout'
import SelectedAuraProvider, {
  useSelectedAura,
} from 'components/Search/SelectedAuraProvider'
import AuraDialog from 'components/AuraDialog'
import { Dialog, DialogContent } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {},
  }),
)

const SearchPageInner = () => {
  const classes = useStyles()

  const [selectedAura, setSelectedAura] = useSelectedAura()

  return (
    <>
      <SearchDrawer />
      <InfiniteHits />
      <Dialog
        className={classes.dialog}
        fullWidth
        maxWidth='lg'
        open={selectedAura !== undefined}
        onClose={() => setSelectedAura?.(undefined)}
      >
        <DialogContent>
          {selectedAura && <AuraDialog preview={selectedAura} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

const SearchPage = () => {
  return (
    <SelectedAuraProvider>
      <Layout title='Search'>
        <SearchPageInner />
      </Layout>
    </SelectedAuraProvider>
  )
}

export default SearchPage
