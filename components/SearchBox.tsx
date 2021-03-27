import { connectSearchBox, SearchBoxProvided } from 'react-instantsearch-core'
import React, { useCallback, useEffect, useState } from 'react'
import { InputBase } from '@material-ui/core'
import { useRouter } from 'next/router'
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

type ChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>

const differentRefinement = (before: string, after: string) => {
  return before.trim().toLowerCase() !== after.trim().toLowerCase()
}

const SearchBox = ({ refine, currentRefinement }: SearchBoxProvided) => {
  const classes = useStyles()

  const [search, setSearch] = useState(currentRefinement)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timer])

  const onChange = (event: ChangeEvent) => {
    const { value } = event.target
    setSearch(value)

    if (timer) clearTimeout(timer)

    if (differentRefinement(currentRefinement, value)) {
      setTimer(
        setTimeout(() => {
          refine(value)
        }, 100),
      )
    }
  }

  return (
    <InputBase
      value={search}
      onChange={onChange}
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
