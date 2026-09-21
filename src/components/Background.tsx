import { useEffect } from 'react'

export default function Background() {
  useEffect(() => {
    const root = document.documentElement
    const bar = document.getElementById('progress')
    const move = (e: PointerEvent) => {
      root.style.setProperty('--mx', e.clientX + 'px')
      root.style.setProperty('--my', e.clientY + 'px')
    }
    const scroll = () => {
      const max = root.scrollHeight - innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
    }
    addEventListener('pointermove', move)
    addEventListener('scroll', scroll, { passive: true })
    return () => {
      removeEventListener('pointermove', move)
      removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <>
      <div className="progress" id="progress" />
      <div className="bg-glow" />
      <div className="bg-grain" />
    </>
  )
}
