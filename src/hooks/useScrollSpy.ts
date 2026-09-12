import { useEffect, useState } from 'react'

/** Returns the id of the section currently nearest the top of the viewport. */
export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) current = id
      }
      // Pin the last section once the page is scrolled to the bottom, otherwise
      // a short final section can never become active.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = ids[ids.length - 1] ?? current
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}
