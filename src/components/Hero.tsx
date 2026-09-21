import { useEffect, useRef, useState } from 'react'

const words = ['sites que vendem.', 'marketing que converte.', 'sistemas que escalam.', 'apps que encantam.']

function useTyper() {
  const [text, setText] = useState('')
  useEffect(() => {
    let w = 0
    let i = 0
    let del = false
    let t: number
    const tick = () => {
      const word = words[w]
      i += del ? -1 : 1
      setText(word.slice(0, i))
      let wait = del ? 28 : 70
      if (!del && i === word.length) {
        del = true
        wait = 1800
      } else if (del && i === 0) {
        del = false
        w = (w + 1) % words.length
        wait = 350
      }
      t = window.setTimeout(tick, wait)
    }
    t = window.setTimeout(tick, 1400)
    return () => clearTimeout(t)
  }, [])
  return text
}

// Bolhas de sabão subindo, que fogem do cursor.
function Bubbles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: -999, y: -999 }
    type P = { x: number; y: number; r: number; vy: number; vx: number; ph: number }
    let ps: P[] = []
    const spawn = (y: number): P => ({
      x: Math.random() * w,
      y,
      r: 2 + Math.random() * 9,
      vy: 0.15 + Math.random() * 0.5,
      vx: 0,
      ph: Math.random() * 6.28,
    })
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(70, Math.round(w / 22))
      ps = Array.from({ length: n }, () => spawn(Math.random() * h))
    }
    const move = (e: PointerEvent) => {
      const b = c.getBoundingClientRect()
      mouse.x = e.clientX - b.left
      mouse.y = e.clientY - b.top
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d = Math.hypot(dx, dy) || 1
        if (d < 130) {
          p.vx += (dx / d) * 0.6
          p.y += (dy / d) * 0.8
        }
        p.vx *= 0.95
        p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.25
        p.y -= p.vy
        if (p.y < -20) Object.assign(p, spawn(h + 20))
        const g = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r)
        g.addColorStop(0, 'rgba(255,255,255,.28)')
        g.addColorStop(0.7, 'rgba(110,231,183,.06)')
        g.addColorStop(1, 'rgba(56,189,248,.28)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 6.283)
        ctx.fillStyle = g
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,.16)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
    }
  }, [])
  return <canvas ref={ref} aria-hidden />
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Hero() {
  const typed = useTyper()
  return (
    <header className="hero" id="top">
      <Bubbles />
      <div className="wrap">
        <div className="badge">
          <span className="dot" /> Disponível para novos projetos
        </div>
        <h1>
          <span className="line">
            <span style={{ ['--d' as string]: '.15s' }}>Nicolas Souza.</span>
          </span>
          <span className="line">
            <span style={{ ['--d' as string]: '.3s' }} className="grad-text">Dev Full Stack</span>
          </span>
          <span className="line">
            <span style={{ ['--d' as string]: '.45s' }}>&amp; marketing.</span>
          </span>
        </h1>
        <p className="lead">
          Na <strong style={{ color: 'var(--text)', fontWeight: 500 }}>Arrow Shot</strong> cuido do marketing de
          empresas de limpeza, criando <span className="rotator">{typed}<span className="cursor" /></span>
        </p>
        <div className="actions">
          <button className="btn primary" onClick={() => go('projetos')}>
            Ver projetos <span className="arr">↓</span>
          </button>
          <button className="btn" onClick={() => go('contato')}>
            Falar comigo <span className="arr">↗</span>
          </button>
        </div>
      </div>
      <div className="scroll-hint" />
    </header>
  )
}
