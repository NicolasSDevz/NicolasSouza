interface Project {
  type: string
  name: string
  description: string
  tags: string[]
  display: string
  url?: string // sem url = sem link (privado ou só projeto pessoal)
  restricted?: boolean
}

const sites: Project[] = [
  {
    type: 'site institucional · Arrow Shot',
    name: 'Limpeza Técnica',
    description:
      'Site para empresa de limpeza pós-obra no Rio Grande do Sul, focado em captar orçamentos de residências e estabelecimentos.',
    tags: ['Front-end', 'Responsivo', 'SEO', 'Deploy'],
    url: 'https://limpezatecnica.com.br/',
    display: 'limpezatecnica.com.br',
  },
  {
    type: 'site institucional · Arrow Shot',
    name: 'Donna Clean',
    description:
      'Site premium para limpeza pós-obra de alto padrão em Salvador e região metropolitana, para residências, escritórios e empresas.',
    tags: ['Front-end', 'Responsivo', 'SEO', 'Deploy'],
    url: 'https://dcservicosba.com.br/',
    display: 'dcservicosba.com.br',
  },
  {
    type: 'site institucional · Arrow Shot',
    name: 'Impactus Limpeza',
    description:
      'Site de limpeza técnica de alto padrão na Grande Vitória, com pós-obra e limpeza de vidros e fachadas.',
    tags: ['Front-end', 'Responsivo', 'SEO', 'Deploy'],
    url: 'https://impactuslimpeza.com.br/',
    display: 'impactuslimpeza.com.br',
  },
]

const others: Project[] = [
  {
    type: 'sistema web',
    name: 'Orçamento de Extintores',
    description: 'Sistema web para gerar orçamentos de extintores. Em produção, com acesso restrito.',
    tags: ['Em produção', 'Sistema web'],
    display: 'acesso restrito',
    restricted: true,
  },
  {
    type: 'mobile app',
    name: 'QRHUNT',
    description:
      'App para escanear QR Codes e colecionar insígnias em um inventário pessoal, com Firebase para dados e imagens.',
    tags: ['Expo', 'React', 'Firebase', 'QR Scanner'],
    display: 'projeto pessoal',
  },
  {
    type: 'landing page',
    name: 'Bistrô',
    description: 'Landing page elegante para restaurante, com cardápio e informações de contato.',
    tags: ['HTML', 'Tailwind', 'Vite', 'JavaScript'],
    display: 'projeto pessoal',
  },
  {
    type: 'landing page',
    name: 'Surf',
    description: 'Landing page moderna para marca de surf, com galeria e seção de produtos.',
    tags: ['HTML', 'Tailwind', 'Vite', 'JavaScript'],
    display: 'projeto pessoal',
  },
]

const tilt = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget.firstElementChild as HTMLElement
  const b = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - b.left) / b.width - 0.5
  const y = (e.clientY - b.top) / b.height - 0.5
  el.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
}
const untilt = (e: React.MouseEvent<HTMLElement>) => {
  ;(e.currentTarget.firstElementChild as HTMLElement).style.transform = ''
}

function Card({ p, i }: { p: Project; i: number }) {
  const inner = (
    <div className="tilt">
      <div className="browser">
        <div className="bar">
          <i />
          <i />
          <i />
          <em>{p.display}</em>
        </div>
        <div className="shot">
          <div className="page">
            <div className="w-nav">
              <div className="logo-pill">{p.name}</div>
              <span />
              <span />
              <span />
              <b />
            </div>
            <div className="w-hero">
              <div className="lines">
                <i />
                <i />
                <u />
                <u />
                <em />
              </div>
              <div className="img" />
            </div>
            <div className="w-row">
              <i />
              <i />
              <i />
            </div>
            <div className="w-band" />
            <div className="w-row">
              <i />
              <i />
              <i />
            </div>
            <div className="w-hero">
              <div className="img" />
              <div className="lines">
                <i />
                <i />
                <u />
                <u />
              </div>
            </div>
          </div>
          {p.url && <span className="visit">Visitar ↗</span>}
        </div>
      </div>
      <div className="info">
        <div className="type">{p.type}</div>
        <h3>
          <span>
            {p.name}
            {p.restricted && <span className="pill-tag">Acesso restrito</span>}
          </span>
          {p.url && <span className="arr">↗</span>}
        </h3>
        <p>{p.description}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
  const common = {
    style: { ['--d' as string]: `${i * 0.1}s` },
    onMouseMove: tilt,
    onMouseLeave: untilt,
  }
  return p.url ? (
    <a className="project reveal" href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="VER" {...common}>
      {inner}
    </a>
  ) : (
    <div className="project static reveal" {...common}>
      {inner}
    </div>
  )
}

const dealFeatures = [
  'Calculadora de preço em 5 etapas, com alerta de margem baixa',
  'Funil de propostas com follow-up e registro de pagamento',
  'Apresentação em slides (Padrão + Premium) e PDF do orçamento',
  'Painel de resultados e painel administrativo (MRR, clientes)',
]

function DealShot() {
  return (
    <div className="feature reveal">
      <div>
        <div className="status">Em lançamento · acesso restrito</div>
        <h3>
          Deal <span className="em">Shot</span>
        </h3>
        <p className="desc">
          Plataforma por assinatura para empresas de limpeza montarem orçamentos profissionais, apresentarem a proposta
          e acompanharem a venda até o recebimento. Da Arrow Shot, desenvolvida por mim.
        </p>
        <ul className="feat-list">
          {dealFeatures.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="tags">
          {['React 19', 'TypeScript', 'Vite', 'Firebase', 'Vercel', 'jsPDF'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="note">Produto pago, ainda sem acesso público.</div>
      </div>
      <div className="app" aria-hidden>
        <div className="app-bar">
          <i />
          <i />
          <i />
          <em>deal shot · propostas</em>
        </div>
        <div className="app-body">
          <div className="steps">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= 3 ? 'on' : ''}>
                {n}
              </span>
            ))}
            <small>Calculadora · etapa 3 de 5</small>
          </div>
          <div className="kanban">
            <div className="col">
              <h4>Em aberto</h4>
              <div className="kcard" style={{ ['--k' as string]: 0 }}>
                Pós-obra · Apto 82<b>R$ 4.850</b>
              </div>
              <div className="kcard" style={{ ['--k' as string]: 1 }}>
                Fachada · Edifício<b>R$ 7.200</b>
              </div>
            </div>
            <div className="col">
              <h4>Aguardando</h4>
              <div className="kcard" style={{ ['--k' as string]: 2 }}>
                Pós-obra · Loja<b>R$ 3.400</b>
              </div>
            </div>
            <div className="col">
              <h4>Fechado</h4>
              <div className="kcard won" style={{ ['--k' as string]: 3 }}>
                Pós-obra · Casa<b>R$ 5.900</b>
              </div>
            </div>
          </div>
          <div className="meter-row">
            Margem
            <div className="meter">
              <i />
            </div>
            <b>32%</b>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projetos">
      <div className="wrap">
        <div className="reveal">
          <div className="label">
            <b>03</b> projetos
          </div>
          <h2 className="h2">
            Do site ao <span className="em">SaaS.</span>
          </h2>
          <p className="lead">Sites em produção, uma plataforma em lançamento e projetos próprios.</p>
        </div>

        <DealShot />

        <h3 className="sub-title reveal">Sites em produção · Arrow Shot</h3>
        <div className="projects">
          {sites.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </div>

        <h3 className="sub-title reveal">Sistemas e projetos pessoais</h3>
        <div className="projects">
          {others.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
