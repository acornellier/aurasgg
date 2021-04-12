import {
  Check as CheckIcon,
  FileCopy as FileCopyIcon,
} from '@material-ui/icons'
import { Button, IconButton, useTheme } from '@material-ui/core'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

interface Props {
  code: string
  iconOnly?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      height: '100%',
    },
    successIcon: {
      color: theme.palette.success.main,
    },
  }),
)

const CopyCode = ({ code, iconOnly }: Props) => {
  const classes = useStyles()

  const [copied, setCopied] = useState(false)

  const copyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  const icon = copied ? (
    <CheckIcon className={classes.successIcon} />
  ) : (
    <FileCopyIcon />
  )

  if (iconOnly) {
    return (
      <IconButton className={classes.iconButton} onClick={copyCode}>
        {icon}
      </IconButton>
    )
  }

  return (
    <Button variant='contained' onClick={copyCode} color='primary'>
      {copied ? 'Copied' : 'Copy'} import string
      {icon}
    </Button>
  )
}

export default CopyCode
