import { useEffect, useState } from 'react'
import Mark from './Mark'

export default function Preloader() {
  const [n, setN] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 2000
    const t0 = performance.now()
    let raf = 0
    const timers: number[] = []
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setN(1 - Math.pow(1 - p, 2))
      if (p < 1) {
        raf = requestAnimationFrame(step)
        return
      }
      // 1) fresta de luz no meio  2) as duas metades se abrem  3) o site entra
      setOut(true)
      timers.push(
        window.setTimeout(() => {
          root.classList.remove('loading')
          root.classList.add('loaded')
        }, 750),
        window.setTimeout(() => setGone(true), 2100)
      )
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [])

  if (gone) return null
  return (
    <div className={'pre' + (out ? ' out' : '')} aria-hidden>
      <div className="panel t" />
      <div className="panel b" />
      <div className="seam" />
      <div className="center">
        <Mark progress={n} />
        <div className="pre-name">
          Nicolas Souza
          <small>Dev Full Stack · Marketing</small>
        </div>
        <div className="pre-count">{String(Math.round(n * 100)).padStart(3, '0')}</div>
      </div>
    </div>
  )
}
