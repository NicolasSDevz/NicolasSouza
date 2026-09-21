import { useEffect, useMemo, useState } from 'react'

// linhas do "boot" e o ponto do progresso em que cada uma aparece
const log: Array<[number, string, boolean]> = [
  [0.02, '> iniciando portfólio…', false],
  [0.25, '✓ react', true],
  [0.45, '✓ typescript', true],
  [0.65, '✓ node.js', true],
  [0.9, '✓ pronto.', true],
]

export default function Preloader() {
  const [n, setN] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  // grade de blocos que cobre a tela; cada bloco colapsa com atraso proporcional à distância do centro
  const grid = useMemo(() => {
    const size = innerWidth < 700 ? 70 : 96
    const cols = Math.ceil(innerWidth / size)
    const rows = Math.ceil(innerHeight / size)
    const tiles = Array.from({ length: cols * rows }, (_, i) => {
      const cx = (i % cols) - (cols - 1) / 2
      const cy = Math.floor(i / cols) - (rows - 1) / 2
      return Math.round(Math.hypot(cx, cy) * 75 + Math.random() * 90)
    })
    return { cols, rows, tiles }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 2400
    const t0 = performance.now()
    let raf = 0
    const timers: number[] = []
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setN(1 - Math.pow(1 - p, 1.8))
      if (p < 1) {
        raf = requestAnimationFrame(step)
        return
      }
      setOut(true)
      timers.push(
        window.setTimeout(() => {
          root.classList.remove('loading')
          root.classList.add('loaded')
        }, 650),
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
  const num = String(Math.round(n * 100)).padStart(3, '0')
  return (
    <div className={'pre' + (out ? ' out' : '')} aria-hidden>
      <div className="tiles" style={{ ['--cols' as string]: grid.cols, ['--rows' as string]: grid.rows }}>
        {grid.tiles.map((dl, i) => (
          <div key={i} className="tile" style={{ ['--dl' as string]: dl }} />
        ))}
      </div>
      <div className="center">
        <div className="pre-big" aria-hidden>
          <span className="ghost">{num}</span>
          <span className="fill" style={{ clipPath: `inset(${100 - n * 100}% 0 0 0)` }}>
            {num}
          </span>
          <sup>%</sup>
        </div>
        <div className="pre-name">
          Nicolas Souza
          <small>Desenvolvedor Full Stack</small>
        </div>
        <div className="pre-log">
          {log.filter(([at]) => n >= at).map(([, text, ok]) => (
            <div key={text} className={ok ? 'ok' : ''}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
