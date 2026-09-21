import { useEffect, useRef, useState } from 'react'

// Palavras iniciadas com "_" ganham destaque
const statement =
  'Sou desenvolvedor full stack e construo aplicações web e mobile de ponta a ponta com _JavaScript,_ _React_ e Node.js. Acredito que bom software vai além de funcionar: precisa ser legível, fácil de manter e preparado para _crescer._'

// Acende as palavras conforme o scroll (só processa enquanto está na tela)
function ScrollText() {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = statement.split(' ')

  useEffect(() => {
    const el = ref.current!
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.word'))
    let raf = 0
    let last = -1
    const update = () => {
      raf = 0
      const b = el.getBoundingClientRect()
      const p = Math.min(Math.max((innerHeight * 0.85 - b.top) / (b.height + innerHeight * 0.25), 0), 1)
      const count = Math.round(p * spans.length)
      if (count === last) return
      last = count
      spans.forEach((s, i) => s.classList.toggle('on', i < count))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        removeEventListener('scroll', onScroll)
        if (e.isIntersecting) {
          update()
          addEventListener('scroll', onScroll, { passive: true })
        }
      },
      { rootMargin: '20% 0px' }
    )
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('scroll', onScroll)
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
        const p = Math.min((t - t0) / 1200, 1)
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
              <span className="yr">ATUAL</span>
              <div>
                <b>Desenvolvedor na Arrow Shot</b>
                <small>Sites para empresas de limpeza</small>
              </div>
            </div>
          </div>
          <div className="stats reveal" style={{ ['--d' as string]: '.15s' }}>
            <div className="stat">
              <Count to={3} suffix="+" />
              <small>sites em produção</small>
            </div>
            <div className="stat">
              <Count to={3} />
              <small>projetos pessoais</small>
            </div>
            <div className="stat">
              <Count to={19} />
              <small>tecnologias na stack</small>
            </div>
            <div className="stat">
              <Count to={2} />
              <small>formações em TI</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
