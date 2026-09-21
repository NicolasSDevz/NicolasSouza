import { useEffect, useRef, useState } from 'react'
import { go, useLoaded } from '../hooks'

const words = ['aplicações web.', 'plataformas SaaS.', 'apps mobile.', 'APIs e sistemas.']

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
          tctx.fillStyle = `rgba(200,255,46,${0.15 + k * 0.7})`
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

// Editor de código digitando o perfil
type Tok = [string, string]
const code: Tok[][] = [
  [['k', 'const'], ['', ' nicolas '], ['p', '= {']],
  [['', '  '], ['m', 'role'], ['p', ': '], ['s', '"Full Stack Developer"'], ['p', ',']],
  [['', '  '], ['m', 'stack'], ['p', ': ['], ['s', '"React"'], ['p', ', '], ['s', '"Node.js"'], ['p', ', '], ['s', '"TypeScript"'], ['p', '],']],
  [['', '  '], ['m', 'mobile'], ['p', ': ['], ['s', '"Expo"'], ['p', ', '], ['s', '"Flutter"'], ['p', '],']],
  [['', '  '], ['m', 'building'], ['p', ': '], ['s', '"Deal Shot"'], ['p', ',']],
  [['', '  '], ['m', 'openToWork'], ['p', ': '], ['k', 'true'], ['p', ',']],
  [['p', '};']],
]
const term: Tok[][] = [
  [['m', '$ '], ['', 'npm run build']],
  [['ok', '✓ built in 2.4s']],
]

function Editor() {
  const tilt = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = tilt.current!
    const move = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5
      const y = e.clientY / innerHeight - 0.5
      el.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [])

  let t = 1.5
  const rows = [...code, null, ...term].map((toks, i) => {
    if (!toks) return <div key={i} className="sep" />
    const n = toks.reduce((a, [, x]) => a + x.length, 0)
    const d = t
    t += n * 0.016 + 0.12
    return { toks, n, d, i }
  })
  const last = rows[rows.length - 1] as { d: number; n: number }
  const cd = last.d + last.n * 0.016

  let no = 0
  return (
    <div className="editor-wrap" aria-hidden>
      <div className="editor-tilt" ref={tilt}>
        <div className="editor">
          <div className="editor-bar">
            <i />
            <i />
            <i />
            <em>nicolas.ts</em>
          </div>
          <div className="code">
            {rows.map((r, idx) => {
              if ('type' in (r as object)) return r as JSX.Element
              const { toks, n, d } = r as { toks: Tok[]; n: number; d: number }
              no++
              return (
                <div className="row" key={idx}>
                  <span className="no">{no}</span>
                  <span className="ln" style={{ ['--n' as string]: n, ['--d' as string]: `${d}s` }}>
                    {toks.map(([c, x], k) => (
                      <span key={k} className={c}>
                        {x}
                      </span>
                    ))}
                  </span>
                  {idx === rows.length - 1 && <span className="caret" style={{ ['--cd' as string]: `${cd}s` }} />}
                </div>
              )
            })}
          </div>
        </div>
        <span className="chip c1">React</span>
        <span className="chip c2">Node.js</span>
        <span className="chip c3">TypeScript</span>
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
        <Editor />
      </div>
      <div className="scroll-hint">
        scroll
        <i />
      </div>
    </header>
  )
}
