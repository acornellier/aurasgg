import { connectSearchBox, SearchBoxProvided } from 'react-instantsearch-core'
import React, { useEffect, useState } from 'react'
import { InputBase } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

type KeyboardEvent = React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>

const SearchBox = ({ refine, currentRefinement }: SearchBoxProvided) => {
  const classes = useStyles()

  const [search, setSearch] = useState(currentRefinement)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timer])

  const differentRefinement = (after: string) => {
    return currentRefinement.trim().toLowerCase() !== after.trim().toLowerCase()
  }

  const performSearch = (value = search) => {
    if (timer) clearTimeout(timer)
    if (differentRefinement(value)) refine(value)
  }

  const onChange = (value: string) => {
    setSearch(value)

    if (timer) clearTimeout(timer)

    if (differentRefinement(value)) {
      setTimer(setTimeout(() => performSearch(value), 100))
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') performSearch()
  }

  return (
    <InputBase
      value={search}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder='Search…'
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ 'aria-label': 'search' }}
    />
  )
}

export default connectSearchBox(SearchBox)
