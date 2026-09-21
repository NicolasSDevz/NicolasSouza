import { useEffect, useRef, useState } from 'react'

// Palavras iniciadas com "_" ganham destaque
const statement =
  'Sou desenvolvedor full stack e trabalho com marketing na _Arrow_ _Shot._ Crio sites, estruturo campanhas e organizo o rastreamento para que cada real investido vire _orçamento_ pedido.'

// Acende as palavras conforme o scroll
function ScrollText() {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = statement.split(' ')

  useEffect(() => {
    const el = ref.current!
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.word'))
    let raf = 0
    const update = () => {
      raf = 0
      const b = el.getBoundingClientRect()
      const p = Math.min(Math.max((innerHeight * 0.85 - b.top) / (b.height + innerHeight * 0.25), 0), 1)
      const count = Math.round(p * spans.length)
      spans.forEach((s, i) => s.classList.toggle('on', i < count))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <p className="statement" ref={ref}>
      {words.map((w, i) => {
        const hl = w.startsWith('_')
        return (
          <span key={i}>
            <span className={'word' + (hl ? ' hl' : '')}>{hl ? w.slice(1) : w}</span>{' '}
          </span>
        )
      })}
    </p>
  )
}

function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (t: number) => {
        const p = Math.min((t - t0) / 1400, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return (
    <b ref={ref}>
      {n}
      {suffix}
    </b>
  )
}

export default function About() {
  return (
    <section id="sobre">
      <div className="wrap">
        <div className="label reveal">
          <b>01</b> sobre
        </div>
        <ScrollText />
        <div className="about-grid">
          <div className="edu">
            <div className="edu-item reveal">
              <span className="yr">GRADUAÇÃO</span>
              <div>
                <b>Análise e Desenvolvimento de Sistemas</b>
                <small>UNESC · Universidade do Extremo Sul Catarinense</small>
              </div>
            </div>
            <div className="edu-item reveal" style={{ ['--d' as string]: '.1s' }}>
              <span className="yr">TÉCNICO</span>
              <div>
                <b>Informática para Internet</b>
                <small>IFC · Instituto Federal Catarinense</small>
              </div>
            </div>
            <div className="edu-item reveal" style={{ ['--d' as string]: '.2s' }}>
              <span className="yr">STACK</span>
              <div>
                <b>JavaScript de ponta a ponta</b>
                <small>React, Expo, Node.js e bancos de dados</small>
              </div>
            </div>
          </div>
          <div className="stats reveal" style={{ ['--d' as string]: '.15s' }}>
            <div className="stat">
              <Count to={3} suffix="+" />
              <small>sites de limpeza no ar</small>
            </div>
            <div className="stat">
              <Count to={3} />
              <small>estados atendidos: RS, BA e ES</small>
            </div>
            <div className="stat">
              <Count to={2} />
              <small>frentes: dev + marketing</small>
            </div>
            <div className="stat">
              <Count to={100} suffix="%" />
              <small>foco em resultado</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
