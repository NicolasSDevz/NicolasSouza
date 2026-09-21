import { useEffect, useMemo, useState } from 'react'

const split = (text: string, start: number) =>
  [...text].map((ch, i) => (
    <span key={i} className="pl" style={{ ['--i' as string]: start + i }}>
      {ch}
    </span>
  ))

export default function Preloader() {
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
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduce ? 50 : 2800 // tempo até a abertura dos blocos
    const timers = [
      window.setTimeout(() => setOut(true), hold),
      window.setTimeout(() => {
        root.classList.remove('loading')
        root.classList.add('loaded')
      }, hold + 650),
      window.setTimeout(() => setGone(true), hold + 2100),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  if (gone) return null
  return (
    <div className={'pre' + (out ? ' out' : '')} aria-hidden>
      <div className="tiles" style={{ ['--cols' as string]: grid.cols, ['--rows' as string]: grid.rows }}>
        {grid.tiles.map((dl, i) => (
          <div key={i} className="tile" style={{ ['--dl' as string]: dl }} />
        ))}
      </div>
      <span className="pre-corner tl">Nicolas Souza</span>
      <span className="pre-corner tr">©{new Date().getFullYear()}</span>
      <span className="pre-corner bl">Full Stack</span>
      <span className="pre-corner br">Portfólio</span>
      <div className="center">
        <div className="pre-line" />
        <div>
          <div className="pre-slot">
            <div className="pre-name">
              <span className="r">{split('Nicolas', 0)}</span>
              <span className="r em">{split('Souza', 7)}</span>
            </div>
          </div>
          <div className="pre-sub">Desenvolvedor Full Stack</div>
        </div>
      </div>
    </div>
  )
}
