import { useCallback, useEffect, useRef, useState } from 'react'
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
  if (typeof window === 'undefined') return null

  const start = path.indexOf(searchRouteWithQuery)
  if (start === -1) return null
  return qs.parse(path.slice(start + searchRouteWithQuery.length))
}

export const useSearchState = () => {
  const router = useRouter()

  const [searchState, setSearchState] = useState(
    urlToSearchState(router.asPath) || {},
  )

  useEffect(() => {
    const newSearchState = urlToSearchState(router.asPath)
    console.log('useEffect', router.asPath, newSearchState)
    if (newSearchState !== null) setSearchState(newSearchState)
  }, [router.asPath])

  const timer = useRef<NodeJS.Timeout>()

  const onSearchStateChange = useCallback(
    (newSearchState: Record<string, unknown>) => {
      if (timer.current) clearTimeout(timer.current)

      timer.current = setTimeout(() => {
        if (Object.entries(newSearchState).length !== 0) {
          const href = searchStateToUrl(newSearchState)
          router.push(href, href, { shallow: true })
        }
      }, debounceTime)

      setSearchState(newSearchState)
    },
    [timer, setSearchState, router],
  )

  return [searchState, onSearchStateChange] as const
}
