import type { ReactNode } from 'react'

const spot = (e: React.MouseEvent<HTMLElement>) => {
  const b = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--cx', e.clientX - b.left + 'px')
  e.currentTarget.style.setProperty('--cy', e.clientY - b.top + 'px')
}

const icons: Record<string, ReactNode> = {
  target: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24">
      <path d="M4 20V10M10 20V4M16 20v-7M2 20h20" />
    </svg>
  ),
  ads: (
    <svg viewBox="0 0 24 24">
      <path d="M4 14l16-8v12L4 14z" />
      <path d="M7 15v4" />
    </svg>
  ),
}

const cards = [
  { i: 'globe', t: 'Sites e landing pages', p: 'Design rápido, responsivo e pensado para levar o visitante direto ao WhatsApp.' },
  { i: 'ads', t: 'Tráfego pago', p: 'Campanhas no Google Ads e Meta Ads com foco em orçamentos qualificados.' },
  { i: 'pin', t: 'SEO local', p: 'Presença forte no Google para quem busca limpeza na sua cidade.' },
  { i: 'chart', t: 'Rastreamento', p: 'GTM, pixels e conversões de WhatsApp para saber o que realmente traz cliente.' },
]

export default function Services() {
  return (
    <section id="arrow-shot">
      <div className="wrap">
        <div className="reveal">
          <div className="label">
            <b>02</b> arrow shot
          </div>
          <h2 className="h2">
            Marketing para <span className="em">empresas de limpeza.</span>
          </h2>
          <p className="lead">
            Da vitrine digital ao anúncio: tudo que uma empresa de limpeza precisa para ser encontrada e escolhida.
          </p>
        </div>
        <div className="bento">
          <div className="card wide reveal" onMouseMove={spot}>
            <div className="ico">{icons.target}</div>
            <div className="big">
              Acertar o alvo: quem precisa de limpeza técnica <span className="em">agora.</span>
            </div>
            <p>Especialista em limpeza pós-obra, limpeza de vidros e fachadas e serviços de alto padrão.</p>
          </div>
          {cards.map((c, i) => (
            <div key={c.t} className="card reveal" style={{ ['--d' as string]: `${(i % 3) * 0.1}s` }} onMouseMove={spot}>
              <span className="num">0{i + 1}</span>
              <div className="ico">{icons[c.i]}</div>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
