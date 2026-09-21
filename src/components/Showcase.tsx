import { useEffect, useRef } from 'react'

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

const stages = [
  { t: 'Interface', p: 'Tudo começa em uma tela: rápida, responsiva e pensada para quem vai usar.' },
  { t: 'Componentes', p: 'Por baixo, cada tela é um conjunto de componentes React reutilizáveis e tipados.' },
  { t: 'API', p: 'APIs em Node.js e .NET cuidam das regras de negócio, autenticação e integrações.' },
  { t: 'Dados', p: 'Firebase, MySQL e MongoDB guardam tudo, com modelagem pensada para crescer.' },
]

const routes: Array<[string, string]> = [
  ['GET', '/proposals'],
  ['POST', '/quotes'],
  ['PUT', '/proposals/:id'],
  ['GET', '/results'],
  ['POST', '/auth/login'],
]

const tables: Array<[string, number]> = [
  ['proposals', 3],
  ['users', 3],
  ['plans', 2],
]

export default function Showcase() {
  const box = useRef<HTMLElement>(null)
  const sticky = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current!
    const st = sticky.current!
    let raf = 0
    let lastKey = ''

    const apply = (p: number, force = false) => {
      const r = clamp((p - 0.06) / 0.28)
      const s = clamp((p - 0.3) / 0.32)
      const l = clamp((p - 0.6) / 0.18)
      const inn = clamp(p / 0.08)
      const stage = p < 0.28 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3
      const key = [r, s, l, inn].map((v) => v.toFixed(3)).join() + stage
      if (key === lastKey && !force) return
      lastKey = key
      st.style.setProperty('--r', String(r))
      st.style.setProperty('--s', String(s))
      st.style.setProperty('--l', String(l))
      st.style.setProperty('--in', String(inn))
      st.dataset.stage = String(stage)
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(1, true)
      return
    }

    const update = () => {
      raf = 0
      const b = el.getBoundingClientRect()
      apply(clamp(-b.top / (b.height - innerHeight)))
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
      { rootMargin: '10% 0px' }
    )
    apply(0, true)
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="show" id="showcase" ref={box}>
      <div className="show-sticky" ref={sticky} data-stage="0">
        <div className="wrap show-grid">
          <div className="show-copy">
            <div className="label">
              <b>stack</b> arquitetura
            </div>
            <h2 className="h2">
              Do pixel ao <span className="em">banco de dados.</span>
            </h2>
            <div className="caps">
              {stages.map((s, i) => (
                <div key={s.t} className={'cap c' + i}>
                  <h4>
                    <span>0{i + 1}</span> {s.t}
                  </h4>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
            <div className="dots" aria-hidden>
              {stages.map((s, i) => (
                <i key={s.t} className={'d' + i} />
              ))}
            </div>
          </div>

          <div className="scene" aria-hidden>
            <div className="persp">
              <div className="stack">
                {/* 0 · banco de dados */}
                <div className="layer l-db" style={{ ['--i' as string]: 0 }}>
                  <div className="lbl-mono">firestore</div>
                  <div className="tables">
                    {tables.map(([name, n]) => (
                      <div key={name} className="tbl">
                        <b>{name}</b>
                        {Array.from({ length: n }, (_, k) => (
                          <i key={k} style={{ width: `${88 - k * 18}%` }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1 · API */}
                <div className="layer l-api" style={{ ['--i' as string]: 1 }}>
                  <div className="lbl-mono">server.ts</div>
                  <div className="routes">
                    {routes.map(([m, path]) => (
                      <div key={path} className="route">
                        <span className={'m ' + m.toLowerCase()}>{m}</span>
                        <code>{path}</code>
                        <em>200</em>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 · componentes */}
                <div className="layer l-comp" style={{ ['--i' as string]: 2 }}>
                  <div className="box" style={{ top: 38, height: 44 }}>{'<Header />'}</div>
                  <div className="box" style={{ top: 92, height: 96 }}>{'<StatCard />'}</div>
                  <div className="box" style={{ top: 198, height: 120 }}>{'<ProposalList />'}</div>
                  <div className="box" style={{ top: 330, height: 44 }}>{'<Button />'}</div>
                  <div className="box" style={{ top: 424, height: 40 }}>{'<TabBar />'}</div>
                </div>

                {/* 3 · interface (o celular) */}
                <div className="layer l-ui" style={{ ['--i' as string]: 3 }}>
                  <div className="notch" />
                  <div className="u-head">
                    <b>Propostas</b>
                    <span />
                  </div>
                  <div className="u-stat">
                    <small>Fechado no mês</small>
                    <b>R$ 5.900</b>
                    <div className="bars">
                      {[40, 62, 48, 80, 66, 100].map((h, i) => (
                        <i key={i} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="u-list">
                    {['Pós-obra · Apto 82', 'Fachada · Edifício', 'Pós-obra · Loja'].map((t) => (
                      <div key={t}>
                        <i />
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="u-btn">+ Nova proposta</div>
                  <div className="u-tab">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>

              <div className="labs">
                <div className="lab lab-ui" style={{ ['--k' as string]: 3 }}>
                  Interface <small>React · Expo</small>
                </div>
                <div className="lab lab-comp" style={{ ['--k' as string]: 2 }}>
                  Componentes <small>TypeScript</small>
                </div>
                <div className="lab lab-api" style={{ ['--k' as string]: 1 }}>
                  API <small>Node.js · .NET</small>
                </div>
                <div className="lab lab-db" style={{ ['--k' as string]: 0 }}>
                  Dados <small>Firebase · MySQL · MongoDB</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
