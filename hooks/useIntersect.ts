import { useEffect, useRef, useState } from 'react'

interface Config {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export const useIntersect = (config?: Config) => {
  const [entry, updateEntry] = useState<IntersectionObserverEntry | null>(null)
  const [node, setNode] = useState<HTMLElement | null>(null)

  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new window.IntersectionObserver(
      ([entry]) => updateEntry(entry),
      config,
    )

    const { current: currentObserver } = observer

    if (node) currentObserver.observe(node)

    return () => currentObserver.disconnect()
  }, [node, config])

  return [setNode, entry] as const
}
