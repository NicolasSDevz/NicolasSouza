import { useEffect, useRef, useState } from 'react'
import { go, useLoaded } from '../hooks'

const words = ['sites que vendem.', 'marketing que converte.', 'sistemas que escalam.', 'apps que encantam.']

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

// Campo de pontos que reage ao cursor
function DotField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const sp = 36
    let w = 0
    let h = 0
    let raf = 0
    const m = { x: -999, y: -999 }
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (e: PointerEvent) => {
      const b = c.getBoundingClientRect()
      m.x = e.clientX - b.left
      m.y = e.clientY - b.top
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let x = sp / 2; x < w; x += sp) {
        for (let y = sp / 2; y < h; y += sp) {
          const dx = x - m.x
          const dy = y - m.y
          const d = Math.hypot(dx, dy)
          const k = d < 170 ? 1 - d / 170 : 0
          const wave = 0.5 + 0.5 * Math.sin((x + y) / 120 + t / 1100)
          const ox = k ? (dx / d) * k * 12 : 0
          const oy = k ? (dy / d) * k * 12 : 0
          ctx.beginPath()
          ctx.arc(x + ox, y + oy, 1 + k * 2.4 + wave * 0.5, 0, 6.283)
          ctx.fillStyle = k > 0.02 ? `rgba(255,91,35,${0.3 + k * 0.7})` : `rgba(244,241,234,${0.08 + wave * 0.14})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) draw(0)
    else raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
    }
  }, [])
  return <canvas ref={ref} aria-hidden />
}

// Alvo com flecha: assinatura da Arrow Shot
function Target() {
  const tilt = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = tilt.current!
    const move = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5
      const y = e.clientY / innerHeight - 0.5
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`
    }
    addEventListener('pointermove', move)
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
              <line x1="16" y1="0" x2="176" y2="0" stroke="#f4f1ea" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="0,0 24,-8 24,8" fill="#ff5b23" />
              <polygon points="150,0 172,-13 182,-13 166,0" fill="#ff5b23" />
              <polygon points="150,0 172,13 182,13 166,0" fill="#ff5b23" />
              <polygon points="164,0 184,-11 192,-11 176,0" fill="#f4f1ea" />
              <polygon points="164,0 184,11 192,11 176,0" fill="#f4f1ea" />
            </g>
          </g>
        </svg>
        <span className="chip c1">Google Ads</span>
        <span className="chip c2">Meta Ads</span>
        <span className="chip c3">WhatsApp</span>
        <span className="chip c4">SEO local</span>
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
            <span className="dot" /> Disponível para novos projetos
          </div>
          <h1 aria-label="Nicolas Souza, Dev Full Stack e marketing">
            <span className="row">
              <Split text="Nicolas Souza" start={0} />
            </span>
            <span className="row role">
              <Split text="Dev Full Stack" start={14} />
            </span>
            <span className="row role">
              <Split text="&" start={28} /> <Split text="marketing" start={30} className="em" />
            </span>
          </h1>
          <p className="lead">
            Na <strong style={{ color: 'var(--text)', fontWeight: 500 }}>Arrow Shot</strong> cuido do marketing de
            empresas de limpeza, criando{' '}
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
