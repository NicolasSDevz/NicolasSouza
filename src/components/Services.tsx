const spot = (e: React.MouseEvent<HTMLElement>) => {
  const b = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--cx', e.clientX - b.left + 'px')
  e.currentTarget.style.setProperty('--cy', e.clientY - b.top + 'px')
}

const cards = [
  { i: '🌐', t: 'Sites e landing pages', p: 'Design rápido, responsivo e pensado para levar o visitante direto ao WhatsApp.' },
  { i: '🎯', t: 'Tráfego pago', p: 'Campanhas no Google Ads e Meta Ads com foco em orçamentos qualificados.' },
  { i: '📍', t: 'SEO local', p: 'Presença forte no Google para quem busca limpeza na sua cidade.' },
  { i: '📊', t: 'Rastreamento', p: 'GTM, pixels e conversões de WhatsApp para saber o que realmente traz cliente.' },
]

export default function Services() {
  return (
    <section id="arrow-shot">
      <div className="wrap">
        <div className="reveal">
          <div className="label">arrow shot</div>
          <h2 className="h2">
            Marketing para <span className="grad-text">empresas de limpeza.</span>
          </h2>
          <p className="lead">
            Da vitrine digital ao anúncio: tudo que uma empresa de limpeza precisa para ser encontrada e escolhida.
          </p>
        </div>
        <div className="bento">
          <div className="card wide reveal" onMouseMove={spot}>
            <div className="ico">🏹</div>
            <div className="big">
              Acertar o alvo certo: quem precisa de limpeza técnica <span className="grad-text">agora.</span>
            </div>
            <p>Especialista em limpeza pós-obra, limpeza de vidros e fachadas e serviços de alto padrão.</p>
          </div>
          {cards.map((c, i) => (
            <div key={c.t} className="card reveal" style={{ ['--d' as string]: `${(i % 3) * 0.1}s` }} onMouseMove={spot}>
              <div className="ico">{c.i}</div>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
