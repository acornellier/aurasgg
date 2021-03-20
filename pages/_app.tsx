import 'pages/app.css'
import 'instantsearch.css/themes/satellite.css'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App
