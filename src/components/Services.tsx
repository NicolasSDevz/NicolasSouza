import type { ReactNode } from 'react'

const icons: Record<string, ReactNode> = {
  code: (
    <svg viewBox="0 0 24 24">
      <path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24">
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  ),
  db: (
    <svg viewBox="0 0 24 24">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
}

const cards = [
  { i: 'code', t: 'Front-end', p: 'React, TypeScript e Tailwind. Interfaces rápidas, acessíveis e responsivas.' },
  { i: 'server', t: 'Back-end', p: 'APIs em Node.js e .NET, com regras de negócio bem organizadas.' },
  { i: 'phone', t: 'Mobile', p: 'Apps com Expo e Flutter, integrados a Firebase.' },
  { i: 'db', t: 'Bancos de dados', p: 'Modelagem e consultas em MySQL, MongoDB e Firebase.' },
]

export default function Services() {
  return (
    <section id="atuacao">
      <div className="wrap">
        <div className="reveal">
          <div className="label">
            <b>02</b> atuação
          </div>
          <h2 className="h2">
            Do banco de dados à <span className="em">interface.</span>
          </h2>
          <p className="lead">Trabalho em todas as camadas de uma aplicação, com JavaScript como base.</p>
        </div>
        <div className="bento">
          <div className="card wide reveal">
            <div className="ico">{icons.target}</div>
            <div className="big">
              Dev na Arrow Shot: sites e um SaaS para empresas de <span className="em">limpeza.</span>
            </div>
            <p>A Arrow Shot é uma agência de marketing para limpeza. Eu desenvolvo os sites dos clientes e o Deal Shot, plataforma de orçamentos.</p>
          </div>
          {cards.map((c, i) => (
            <div key={c.t} className="card reveal" style={{ ['--d' as string]: `${(i % 3) * 0.08}s` }}>
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
