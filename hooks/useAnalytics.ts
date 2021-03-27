import { useEffect } from 'react'
import { analytics } from 'utils/firebase'
import { useRouter } from 'next/router'

export const useAnalytics = () => {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return

    const logEvent = (url: string) => {
      analytics().setCurrentScreen(url)
      analytics().logEvent('screen_view')
    }

    router.events.on('routeChangeComplete', logEvent)
    logEvent(window.location.pathname)

    return () => {
      router.events.off('routeChangeComplete', logEvent)
    }
  }, [router.events])
}
