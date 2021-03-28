import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const qs = require('qs')

const searchRoute = '/search'
const searchRouteWithQuery = searchRoute + '?'
const debounceTime = 500

export const createURL = (state: any) =>
  `?${qs.stringify({ ...state, page: undefined })}`

const searchStateToUrl = (state: any) =>
  state ? `/search${createURL(state)}` : ''

const urlToSearchState = (path: string) => {
  const start = path.indexOf(searchRouteWithQuery)
  if (start === -1) return {}
  return qs.parse(path.slice(start + searchRouteWithQuery.length))
}

export const useSearchState = () => {
  const router = useRouter()

  const [searchState, setSearchState] = useState(
    urlToSearchState(router.asPath),
  )

  useEffect(() => {
    setSearchState(urlToSearchState(router.asPath))
  }, [router.asPath])

  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const onSearchStateChange = useCallback(
    (newSearchState: any) => {
      if (timer) clearTimeout(timer)

      setTimer(
        setTimeout(() => {
          const href = searchStateToUrl(newSearchState)
          router.push(href, href, { shallow: true })
        }, debounceTime),
      )

      setSearchState(newSearchState)
    },
    [timer, setSearchState, setTimer, router],
  )

  return [searchState, onSearchStateChange] as const
}
