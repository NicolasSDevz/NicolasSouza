import { useEffect, useRef, useState } from 'react'

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

const stages = [
  { t: 'Front-end', p: 'React e TypeScript: componentes reutilizáveis e tipados, com interface rápida e responsiva.' },
  { t: 'Back-end', p: 'APIs em Node.js e .NET cuidam das regras de negócio, da autenticação e das integrações.' },
  { t: 'Banco de dados', p: 'Modelagem em MySQL, MongoDB e Firebase, pensada para o produto crescer.' },
  { t: 'Deploy', p: 'Build, versionamento com Git e publicação na Vercel. Do commit ao ar, em um comando.' },
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
const term = [
  '$ npm test',
  '✓ calcPrice › applies margin',
  '✓ proposals › creates quote',
  '✓ 24 tests passed',
  '$ npm run build',
  '✓ built in 2.1s',
  '$ vercel --prod',
  'deploying to production...',
  '✓ deployed to production',
]
const TERM_BAR_AFTER = 7 // barra de progresso depois da linha "deploying..."

// logs "ao vivo" que chegam depois do deploy
const reqs: Array<[string, string, string]> = [
  ['GET', '/proposals', '200'],
  ['POST', '/quotes', '201'],
  ['GET', '/results', '200'],
  ['PUT', '/proposals/42', '200'],
  ['GET', '/auth/me', '200'],
  ['POST', '/auth/login', '200'],
]

function LiveLogs({ on }: { on: boolean }) {
  const [items, setItems] = useState<Array<{ id: number; t: string; m: string; p: string; s: string; ms: number }>>([])
  useEffect(() => {
    if (!on) {
      setItems([])
      return
    }
    let id = 0
    let sec = 7
    let iv = 0
    const t0 = window.setTimeout(() => {
      iv = window.setInterval(() => {
        const [m, p, s] = reqs[id % reqs.length]
        sec += 1 + (id % 3)
        const t = `12:04:${String(sec % 60).padStart(2, '0')}`
        const ms = 8 + ((id * 7) % 23)
        id++
        setItems((prev) => [...prev.slice(-3), { id, t, m, p, s, ms }])
      }, 850)
    }, 4700) // depois que o pipeline termina de digitar
    return () => {
      clearTimeout(t0)
      clearInterval(iv)
    }
  }, [on])

  return (
    <div className="logs">
      {items.length > 0 && <div className="logsep">── logs em produção ──</div>}
      {items.map((l) => (
        <div className="lg" key={l.id}>
          <span className="m">{l.t}</span> <span className="f">{l.m.padEnd(4)}</span> {l.p.padEnd(14)}
          <span className="ok">{l.s}</span> <span className="m">{l.ms}ms</span>
        </div>
      ))}
    </div>
  )
}

// ícones de dev ao redor do terminal; um por vez "acende"
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
const tools: Array<{ n: string; i: string; x: number; y: number; side?: boolean }> = [
  { n: 'React', i: 'react/react-original', x: -170, y: -285 },
  { n: 'TypeScript', i: 'typescript/typescript-original', x: 0, y: -285 },
  { n: 'Node.js', i: 'nodejs/nodejs-original', x: 170, y: -285 },
  { n: 'Git', i: 'git/git-original', x: 335, y: 0, side: true },
  { n: 'Docker', i: 'docker/docker-original', x: 170, y: 285 },
  { n: 'Firebase', i: 'firebase/firebase-plain', x: 0, y: 285 },
  { n: 'MySQL', i: 'mysql/mysql-original', x: -170, y: 285 },
  { n: 'VS Code', i: 'vscode/vscode-original', x: -335, y: 0, side: true },
]

function Orbit({ on }: { on: boolean }) {
  const [hot, setHot] = useState(0)
  useEffect(() => {
    if (!on) return
    setHot(0)
    const iv = window.setInterval(() => setHot((h) => (h + 1) % tools.length), 1100)
    return () => clearInterval(iv)
  }, [on])
  return (
    <div className="orbit">
      {tools.map((t, k) => (
        <div
          key={t.n}
          className={'otool' + (hot === k ? ' hot' : '') + (t.side ? ' side' : '')}
          style={{ left: `calc(50% + ${t.x}px)`, top: `calc(50% + ${t.y}px)`, ['--k' as string]: k }}
        >
          <img src={`${DEVICON}/${t.i}.svg`} alt="" width={26} height={26} loading="lazy" />
          <span>{t.n}</span>
        </div>
      ))}
    </div>
  )
}

type Tok = [string, string]
const RE =
  /(--.*$|\/\/.*$)|('[^']*'|"[^"]*")|(<\/?[A-Z]\w*)|\b(export|function|const|return|await|async|CREATE|TABLE|NOT|NULL|PRIMARY|KEY|DEFAULT|INT|VARCHAR|DECIMAL|ENUM|DATETIME|NOW)\b|(\b\d+\b)|(\b[a-zA-Z_]\w*)(?=\()|(^\$ |^✓.*$)/g
const CLS = ['', 'm', 's', 't', 'k', 'n', 'f', 'sh']

// destaque de sintaxe simples (o suficiente para o visual)
function highlight(line: string): Tok[] {
  const out: Tok[] = []
  let last = 0
  for (const m of line.matchAll(RE)) {
    const i = m.index ?? 0
    if (i > last) out.push(['', line.slice(last, i)])
    const g = m.slice(1).findIndex((x) => x !== undefined) + 1
    out.push([g === 7 && m[0].startsWith('✓') ? 'ok' : CLS[g], m[0]])
    last = i + m[0].length
  }
  if (last < line.length) out.push(['', line.slice(last)])
  return out
}

function Win({
  cls,
  i,
  file,
  lines,
  caret,
  barAfter,
  live,
  tabs,
  logging,
}: {
  cls: string
  i: number
  file: string
  lines: string[]
  caret?: boolean
  barAfter?: number
  live?: boolean
  tabs?: string[]
  logging?: boolean
}) {
  return (
    <div className={'layer ' + cls} style={{ ['--i' as string]: i }}>
      <div className="win-bar">
        <i />
        <i />
        <i />
        {tabs ? (
          <div className="tabs">
            {tabs.map((t, k) => (
              <span key={t} className={'tab' + (k === 0 ? ' on' : '')}>
                {t}
              </span>
            ))}
          </div>
        ) : (
          <em>{file}</em>
        )}
        {live && <span className="live">LIVE</span>}
      </div>
      <div className="win-code">
        {lines.map((line, li) => {
          const shift = barAfter !== undefined && li > barAfter ? 1 : 0 // depois da barra, o resto espera ela encher
          const d = 0.15 + li * 0.22 + shift * 0.9
          return (
            <div key={li}>
              <div className="row">
                <span className="no">{li + 1}</span>
                <span className="ln" style={{ ['--n' as string]: line.length, ['--d' as string]: `${d}s` }}>
                  {highlight(line).map(([c, x], k) => (
                    <span key={k} className={c}>
                      {x}
                    </span>
                  ))}
                  {caret && li === lines.length - 1 && <span className="caret" />}
                </span>
              </div>
              {barAfter === li && (
                <div className="row">
                  <span className="no" />
                  <span className="pb" style={{ ['--d' as string]: `${d + 0.35}s` }}>
                    <i />
                  </span>
                </div>
              )}
            </div>
          )
        })}
        {tabs && <LiveLogs on={!!logging} />}
      </div>
      {tabs && (
        <div className="tstatus">
          <span className="ok">● main</span>
          <span>node 20</span>
          <span>0 errors</span>
          <span className="r">vercel · production</span>
        </div>
      )}
    </div>
  )
}

export default function Showcase() {
  const box = useRef<HTMLElement>(null)
  const sticky = useRef<HTMLDivElement>(null)
  const [logging, setLogging] = useState(false)

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
      const t = clamp((p - 0.72) / 0.2)
      const stage = p < 0.28 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3
      const key = [r, s, l, inn, t].map((v) => v.toFixed(3)).join() + stage
      if (key === lastKey && !force) return
      lastKey = key
      st.style.setProperty('--r', String(r * (1 - t)))
      st.style.setProperty('--s', String(s))
      st.style.setProperty('--l', String(l))
      st.style.setProperty('--in', String(inn))
      st.style.setProperty('--t', String(t))
      st.dataset.stage = String(stage)
      setLogging(stage === 3)
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

          <div className="scene" aria-hidden>
            <div className="persp">
              <div className="stack">
                <Win
                  cls="l-term"
                  i={0}
                  file="terminal"
                  lines={term}
                  barAfter={TERM_BAR_AFTER}
                  live
                  tabs={['deploy', 'dev', 'tests']}
                  logging={logging}
                />
                <Win cls="l-sql" i={1} file="schema.sql" lines={sql} />
                <Win cls="l-api" i={2} file="server.ts" lines={api} />
                <Win cls="l-react" i={3} file="ProposalCard.tsx" lines={react} />
              </div>
              <Orbit on={logging} />
              <div className="labs">
                <div className="lab lab-react" style={{ ['--k' as string]: 3 }}>
                  Front-end <small>React · TypeScript</small>
                </div>
                <div className="lab lab-api" style={{ ['--k' as string]: 2 }}>
                  Back-end <small>Node.js · .NET</small>
                </div>
                <div className="lab lab-sql" style={{ ['--k' as string]: 1 }}>
                  Dados <small>MySQL · MongoDB · Firebase</small>
                </div>
                <div className="lab lab-term" style={{ ['--k' as string]: 0 }}>
                  Deploy <small>Git · Vercel</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
