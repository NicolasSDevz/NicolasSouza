import { useEffect } from 'react'

export default function Background() {
  useEffect(() => {
    const root = document.documentElement
    const bar = document.getElementById('progress')
    let raf = 0
    const update = () => {
      raf = 0
      const max = root.scrollHeight - innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div className="progress" id="progress" />
      <div className="bg-glow" />
    </>
  )
}
