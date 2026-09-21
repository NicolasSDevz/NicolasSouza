import { useEffect, useState } from 'react'

// true assim que o preloader termina (html.loaded)
export function useLoaded() {
  const [loaded, setLoaded] = useState(() => document.documentElement.classList.contains('loaded'))
  useEffect(() => {
    if (loaded) return
    const mo = new MutationObserver(() => {
      if (document.documentElement.classList.contains('loaded')) {
        setLoaded(true)
        mo.disconnect()
      }
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [loaded])
  return loaded
}

export const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
