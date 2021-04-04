import React, { useCallback, useState } from 'react'
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core'
import NextLink from 'next/link'

const dungeons = [
  'De Other Side',
  'Halls Of Attonement',
  'Mists Of Tirna Scithe',
  'Plaguefall',
  'Sanguine Depths',
  'Spires Of Ascension',
  'The Necrotic Wake',
  'Theater Of Pain',
]

const HeaderMenu = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }
  let s =
    'http://localhost:5000/search?query=&refinementList%5Btype%5D%5B0%5D=mdt&refinementList%5BcategoryNames%5D%5B0%5D=Spires%20Of%20Ascension'
  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onMouseOver={() => setOpen(true)}
      >
        Routes
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open}>
                  {dungeons.map((dungeon) => (
                    <NextLink
                      key={dungeon}
                      href={`/search?refinementList[type][0]=mdt&refinementList[categoryNames][0]=${dungeon}`}
                    >
                      <MenuItem onClick={handleClose}>{dungeon}</MenuItem>
                    </NextLink>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default HeaderMenu
