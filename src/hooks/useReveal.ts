import { useEffect, useRef } from 'react'

/**
 * Adds `is-visible` to the element (and any `.reveal` descendants, staggered)
 * the first time it scrolls into view. Falls back to visible if
 * IntersectionObserver is unavailable.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(stagger = 70) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const targets: HTMLElement[] = [
      ...(node.classList.contains('reveal') ? [node] : []),
      ...Array.from(node.querySelectorAll<HTMLElement>('.reveal')),
    ]
    if (targets.length === 0) return

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const index = targets.indexOf(el)
          el.style.transitionDelay = `${Math.max(0, index) * stagger}ms`
          el.classList.add('is-visible')
          observer.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [stagger])

  return ref
}
