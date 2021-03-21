import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iframe: {
      width: '100%',
      position: 'absolute',
      height: '100%',
    },
  }),
)

const AuraPage = () => {
  const classes = useStyles()
  const router = useRouter()

  return (
    <iframe
      src={`https://wago.io/${router.query.slug}`}
      className={classes.iframe}
    />
  )
}

export default AuraPage
