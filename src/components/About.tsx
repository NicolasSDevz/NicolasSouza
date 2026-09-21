import { useEffect, useRef, useState } from 'react'

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
      <div className="wrap about-grid">
        <div className="reveal">
          <div className="label">sobre</div>
          <h2 className="h2">
            Código e marketing <span className="grad-text">na mesma cabeça.</span>
          </h2>
          <p>
            Sou <strong>Desenvolvedor Full Stack</strong> cursando Análise e Desenvolvimento de Sistemas na{' '}
            <strong>UNESC</strong>, técnico em Informática para Internet pelo <strong>IFC</strong>. Trabalho com
            JavaScript de ponta a ponta: React, Expo, Node.js e diferentes bancos de dados.
          </p>
          <p>
            Na <strong>Arrow Shot</strong>, atuo com marketing para empresas de limpeza: crio o site, estruturo as
            campanhas e organizo o rastreamento para que cada real investido vire orçamento pedido. Por isso meus sites
            não são só bonitos, são feitos para converter.
          </p>
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
    </section>
  )
}
