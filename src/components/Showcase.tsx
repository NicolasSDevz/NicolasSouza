import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

const stages = [
  { t: 'Front-end', p: 'React e TypeScript: componentes reutilizáveis e tipados, com interface rápida e responsiva.' },
  { t: 'Back-end', p: 'APIs em Node.js e .NET cuidam das regras de negócio, da autenticação e das integrações.' },
  { t: 'Banco de dados', p: 'Modelagem em MySQL, MongoDB e Firebase, pensada para o produto crescer.' },
  { t: 'Deploy', p: 'Do commit ao ar: versionamento, testes, build e publicação. E os sites abaixo já estão no ar.' },
]

// ---- código exibido nas janelas ----
const react = [
  'export function ProposalCard({ p }: Props) {',
  '  const [open, setOpen] = useState(false)',
  '  return (',
  '    <Card onClick={() => setOpen(!open)}>',
  '      <h3>{p.client}</h3>',
  '      <Price value={p.total} />',
  '    </Card>',
  '  )',
  '}',
]
const api = [
  "app.post('/quotes', auth, async (req, res) => {",
  '  const { items, margin } = req.body',
  '  const total = calcPrice(items, margin)',
  "  await db.collection('proposals').add({",
  "    total, status: 'open',",
  '  })',
  '  res.status(201).json({ total })',
  '})',
]
const sql = [
  'CREATE TABLE proposals (',
  '  id      INT PRIMARY KEY,',
  '  client  VARCHAR(80) NOT NULL,',
  '  total   DECIMAL(10, 2),',
  "  status  ENUM('open', 'won', 'lost'),",
  '  created DATETIME DEFAULT NOW()',
  ');',
  '-- índices por cliente e status',
]

type Tok = [string, string]
const RE =
  /(--.*$|\/\/.*$)|('[^']*'|"[^"]*")|(<\/?[A-Z]\w*)|\b(export|function|const|return|await|async|CREATE|TABLE|NOT|NULL|PRIMARY|KEY|DEFAULT|INT|VARCHAR|DECIMAL|ENUM|DATETIME|NOW)\b|(\b\d+\b)|(\b[a-zA-Z_]\w*)(?=\()/g
const CLS = ['', 'm', 's', 't', 'k', 'n', 'f']

// destaque de sintaxe simples (o suficiente para o visual)
function highlight(line: string): Tok[] {
  const out: Tok[] = []
  let last = 0
  for (const m of line.matchAll(RE)) {
    const i = m.index ?? 0
    if (i > last) out.push(['', line.slice(last, i)])
    const g = m.slice(1).findIndex((x) => x !== undefined) + 1
    out.push([CLS[g], m[0]])
    last = i + m[0].length
  }
  if (last < line.length) out.push(['', line.slice(last)])
  return out
}

function Win({ cls, i, file, lines }: { cls: string; i: number; file: string; lines: string[] }) {
  return (
    <div className={'layer ' + cls} style={{ ['--i' as string]: i }}>
      <div className="win-bar">
        <i />
        <i />
        <i />
        <em>{file}</em>
      </div>
      <div className="win-code">
        {lines.map((line, li) => (
          <div className="row" key={li}>
            <span className="no">{li + 1}</span>
            <span className="ln" style={{ ['--n' as string]: line.length, ['--d' as string]: `${0.15 + li * 0.22}s` }}>
              {highlight(line).map(([c, x], k) => (
                <span key={k} className={c}>
                  {x}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- pipeline de deploy (ato final) ----
const svg = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
)
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
const dev = (n: string) => <img src={`${DEVICON}/${n}.svg`} alt="" width={24} height={24} loading="lazy" />

const steps: Array<{ t: string; cmd: string; st: string; icon: ReactNode }> = [
  { t: 'Commit', cmd: 'git push origin main', st: 'enviado', icon: dev('git/git-original') },
  {
    t: 'Testes',
    cmd: 'npm test',
    st: '24 ok',
    icon: svg(
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
  },
  { t: 'Build', cmd: 'vite build', st: '2.1s', icon: dev('vitejs/vitejs-original') },
  {
    t: 'Deploy',
    cmd: 'vercel --prod',
    st: 'pronto',
    icon: svg(
      <>
        <path d="M5 15c-1 1-1.5 3.5-1.5 5 1.5 0 4-.5 5-1.5" />
        <path d="M12 15l-3-3a20 20 0 0 1 8-9c1 0 3 .5 4 1 .5 1 1 3 1 4a20 20 0 0 1-9 8z" />
        <circle cx="15" cy="9" r="1.5" />
      </>
    ),
  },
  {
    t: 'No ar',
    cmd: '',
    st: 'online',
    icon: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
      </>
    ),
  },
]

const liveSites = [
  ['limpezatecnica.com.br', 'https://limpezatecnica.com.br/'],
  ['dcservicosba.com.br', 'https://dcservicosba.com.br/'],
  ['impactuslimpeza.com.br', 'https://impactuslimpeza.com.br/'],
]

export default function Showcase() {
  const box = useRef<HTMLElement>(null)
  const sticky = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(0) // quantos passos do pipeline já acenderam

  useEffect(() => {
    const el = box.current!
    const st = sticky.current!
    let raf = 0
    let lastKey = ''

    const apply = (p: number, force = false) => {
      const r = clamp((p - 0.06) / 0.28)
      const s = clamp((p - 0.3) / 0.32)
      const l = clamp((p - 0.58) / 0.16)
      const inn = clamp(p / 0.08)
      const t = clamp((p - 0.66) / 0.14) // as janelas saem de cena
      const pf = clamp((p - 0.74) / 0.24) // o pipeline se desenha
      const stage = p < 0.26 ? 0 : p < 0.46 ? 1 : p < 0.66 ? 2 : 3
      const n = pf <= 0 ? 0 : Math.min(steps.length, Math.floor(pf * steps.length) + 1)
      const key = [r, s, l, inn, t, pf].map((v) => v.toFixed(3)).join() + stage
      if (key === lastKey && !force) return
      lastKey = key
      st.style.setProperty('--r', String(r))
      st.style.setProperty('--s', String(s))
      st.style.setProperty('--l', String(l))
      st.style.setProperty('--in', String(inn))
      st.style.setProperty('--t', String(t))
      st.style.setProperty('--pf', String(pf))
      st.dataset.stage = String(stage)
      setLit(n)
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
        // "live" liga a digitação e a varredura só enquanto a seção está na tela
        st.dataset.live = e.isIntersecting ? '1' : '0'
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
      <div className="show-sticky" ref={sticky} data-stage="0" data-live="0">
        <div className="wrap show-grid">
          <div className="show-copy">
            <div className="label">
              <b>stack</b> arquitetura
            </div>
            <h2 className="h2">
              Do commit ao <span className="em">deploy.</span>
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

          <div className="scene">
            <div className="persp" aria-hidden>
              <div className="stack">
                <Win cls="l-sql" i={0} file="schema.sql" lines={sql} />
                <Win cls="l-api" i={1} file="server.ts" lines={api} />
                <Win cls="l-react" i={2} file="ProposalCard.tsx" lines={react} />
              </div>
              <div className="labs">
                <div className="lab lab-react" style={{ ['--k' as string]: 2 }}>
                  Front-end <small>React · TypeScript</small>
                </div>
                <div className="lab lab-api" style={{ ['--k' as string]: 1 }}>
                  Back-end <small>Node.js · .NET</small>
                </div>
                <div className="lab lab-sql" style={{ ['--k' as string]: 0 }}>
                  Dados <small>MySQL · MongoDB · Firebase</small>
                </div>
              </div>
            </div>

            <div className="pipe">
              <div className="pipe-line" aria-hidden>
                <i className="pipe-fill" />
                <i className="pipe-packet" />
              </div>
              {steps.map((s, k) => (
                <div key={s.t} className={'node' + (lit > k ? ' on' : '')}>
                  <div className="n-ico" aria-hidden>
                    {s.icon}
                  </div>
                  <div className="n-txt">
                    <b>{s.t}</b>
                    {s.cmd ? (
                      <code>{s.cmd}</code>
                    ) : (
                      <div className="sites">
                        {liveSites.map(([label, href]) => (
                          <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                            {label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="n-st">✓ {s.st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
