import React, { useState } from 'react'
import {
  Button,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core'
import NextLink from 'next/link'

export interface HeaderMenuItem {
  label: string
  href: string
}

interface Props {
  title: string
  link: string
  items: HeaderMenuItem[]
}

const HeaderMenu = ({ title, link, items }: Props) => {
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <div onMouseLeave={() => setOpen(false)}>
      <NextLink href={link}>
        <a>
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            onMouseOver={() => setOpen(true)}
          >
            {title}
          </Button>
        </a>
      </NextLink>
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
              <MenuList autoFocusItem={open}>
                {items.map(({ label, href }) => (
                  <NextLink key={label} href={href}>
                    <a>
                      <MenuItem onClick={handleClose}>{label}</MenuItem>
                    </a>
                  </NextLink>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default HeaderMenu
