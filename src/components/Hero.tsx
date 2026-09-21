import { useEffect, useRef, useState } from 'react'
import { go, useLoaded } from '../hooks'

const words = ['aplicações web.', 'apps mobile.', 'APIs e sistemas.', 'sites rápidos.']

function useTyper(start: boolean) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!start) return
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
    t = window.setTimeout(tick, 2200)
    return () => clearTimeout(t)
  }, [start])
  return text
}

// Título dividido em letras que sobem em cascata
function Split({ text, start, className = '' }: { text: string; start: number; className?: string }) {
  let idx = start
  return (
    <span className={'split ' + className} aria-hidden>
      {text.split(' ').map((word, wi) => (
        <span key={wi}>
          {wi > 0 && ' '}
          <span className="w">
            {[...word].map((ch, ci) => (
              <span key={ci} className="c" style={{ ['--i' as string]: idx++ }}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

// Grade de pontos: a base é desenhada uma vez; só os pontos perto do mouse
// são redesenhados, e apenas enquanto o mouse se move sobre o hero.
function DotField() {
  const base = useRef<HTMLCanvasElement>(null)
  const top = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cb = base.current!
    const ct = top.current!
    const bctx = cb.getContext('2d')!
    const tctx = ct.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 1.5)
    const sp = 44
    const R = 150
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const m = { x: -999, y: -999 }

    const resize = () => {
      w = cb.clientWidth
      h = cb.clientHeight
      for (const c of [cb, ct]) {
        c.width = w * dpr
        c.height = h * dpr
      }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.clearRect(0, 0, w, h)
      for (let x = sp / 2; x < w; x += sp) {
        for (let y = sp / 2; y < h; y += sp) {
          bctx.fillStyle = `rgba(255,255,255,${0.2 * (1 - y / h)})`
          bctx.fillRect(x - 1, y - 1, 2, 2)
        }
      }
    }
    const draw = () => {
      raf = 0
      tctx.clearRect(0, 0, w, h)
      if (!visible) return
      const x0 = Math.max(Math.floor((m.x - R) / sp), 0)
      const x1 = Math.ceil((m.x + R) / sp)
      const y0 = Math.max(Math.floor((m.y - R) / sp), 0)
      const y1 = Math.ceil((m.y + R) / sp)
      for (let gx = x0; gx <= x1; gx++) {
        for (let gy = y0; gy <= y1; gy++) {
          const x = gx * sp + sp / 2
          const y = gy * sp + sp / 2
          const dx = x - m.x
          const dy = y - m.y
          const d = Math.hypot(dx, dy)
          if (d >= R || d === 0) continue
          const k = 1 - d / R
          tctx.beginPath()
          tctx.arc(x + (dx / d) * k * 10, y + (dy / d) * k * 10, 1 + k * 2.2, 0, 6.283)
          tctx.fillStyle = `rgba(255,255,255,${0.15 + k * 0.7})`
          tctx.fill()
        }
      }
    }
    const move = (e: PointerEvent) => {
      const b = cb.getBoundingClientRect()
      m.x = e.clientX - b.left
      m.y = e.clientY - b.top
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible) tctx.clearRect(0, 0, w, h)
    })
    resize()
    io.observe(cb)
    addEventListener('resize', resize)
    addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
    }
  }, [])
  return (
    <>
      <canvas ref={base} aria-hidden />
      <canvas ref={top} aria-hidden />
    </>
  )
}

// Alvo com flecha: assinatura visual
function Target() {
  const tilt = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = tilt.current!
    const move = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5
      const y = e.clientY / innerHeight - 0.5
      el.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [])

  return (
    <div className="target-wrap" aria-hidden>
      <div className="target-tilt" ref={tilt}>
        <svg className="target" viewBox="0 0 400 400">
          {[180, 135, 90, 45].map((r, k) => (
            <circle
              key={r}
              className="ring"
              cx="200"
              cy="200"
              r={r}
              pathLength="1"
              transform="rotate(-90 200 200)"
              style={{ ['--k' as string]: k }}
            />
          ))}
          <circle className="orbit" cx="200" cy="200" r="198" pathLength="200" />
          <circle className="ripple" cx="200" cy="200" r="14" style={{ ['--k' as string]: 0 }} />
          <circle className="ripple" cx="200" cy="200" r="14" style={{ ['--k' as string]: 1 }} />
          <circle className="bull" cx="200" cy="200" r="14" />
          <g transform="translate(200 200) rotate(-32)">
            <g className="arrow">
              <line x1="16" y1="0" x2="176" y2="0" stroke="#ededee" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="0,0 24,-8 24,8" fill="#ffffff" />
              <polygon points="150,0 172,-13 182,-13 166,0" fill="#6a6a72" />
              <polygon points="150,0 172,13 182,13 166,0" fill="#6a6a72" />
              <polygon points="164,0 184,-11 192,-11 176,0" fill="#ededee" />
              <polygon points="164,0 184,11 192,11 176,0" fill="#ededee" />
            </g>
          </g>
        </svg>
        <span className="chip c1">React</span>
        <span className="chip c2">Node.js</span>
        <span className="chip c3">TypeScript</span>
        <span className="chip c4">Expo</span>
      </div>
    </div>
  )
}

export default function Hero() {
  const loaded = useLoaded()
  const typed = useTyper(loaded)
  return (
    <header className="hero" id="top">
      <DotField />
      <div className="wrap hero-grid">
        <div>
          <div className="badge">
            <span className="dot" /> Disponível para novas oportunidades
          </div>
          <h1 aria-label="Nicolas Souza, Desenvolvedor Full Stack">
            <span className="row">
              <Split text="Nicolas Souza" start={0} />
            </span>
            <span className="row">
              <Split text="Desenvolvedor" start={14} />
            </span>
            <span className="row">
              <Split text="Full Stack" start={28} className="em" />
            </span>
          </h1>
          <p className="lead">
            Dev na <strong style={{ color: 'var(--text)', fontWeight: 500 }}>Arrow Shot</strong>, agência de marketing
            para empresas de limpeza. Construo{' '}
            <span className="rotator">
              {typed}
              <span className="cursor" />
            </span>
          </p>
          <div className="actions">
            <button className="btn primary" data-magnetic onClick={() => go('projetos')}>
              Ver projetos <span className="arr">↓</span>
            </button>
            <button className="btn" data-magnetic onClick={() => go('contato')}>
              Falar comigo <span className="arr">↗</span>
            </button>
          </div>
        </div>
        <Target />
      </div>
      <div className="scroll-hint">
        scroll
        <i />
      </div>
    </header>
  )
}
