interface Project {
  type: string
  name: string
  description: string
  tags: string[]
  url: string
  display: string
  c1: string
  c2: string
}

const featured: Project[] = [
  {
    type: 'site institucional · RS',
    name: 'Limpeza Técnica',
    description:
      'Site para empresa de limpeza pós-obra no Rio Grande do Sul, focado em captar orçamentos de residências e estabelecimentos.',
    tags: ['Limpeza pós-obra', 'SEO', 'WhatsApp', 'Responsivo'],
    url: 'https://limpezatecnica.com.br/',
    display: 'limpezatecnica.com.br',
    c1: '#0f766e',
    c2: '#38bdf8',
  },
  {
    type: 'site institucional · BA',
    name: 'Donna Clean',
    description:
      'Site premium para limpeza pós-obra de alto padrão em Salvador e região metropolitana, para residências, escritórios e empresas.',
    tags: ['Alto padrão', 'Salvador', 'SEO local', 'Responsivo'],
    url: 'https://dcservicosba.com.br/',
    display: 'dcservicosba.com.br',
    c1: '#475569',
    c2: '#a78bfa',
  },
  {
    type: 'site institucional · ES',
    name: 'Impactus Limpeza',
    description:
      'Site de limpeza técnica de alto padrão na Grande Vitória, com pós-obra e limpeza de vidros e fachadas.',
    tags: ['Pós-obra', 'Vidros e fachadas', 'Grande Vitória', 'Responsivo'],
    url: 'https://impactuslimpeza.com.br/',
    display: 'impactuslimpeza.com.br',
    c1: '#075985',
    c2: '#38bdf8',
  },
]

const studies: Project[] = [
  {
    type: 'mobile app',
    name: 'QRHUNT',
    description:
      'App para escanear QR Codes e colecionar insígnias em um inventário pessoal, com Firebase para dados e imagens.',
    tags: ['Expo', 'React', 'Firebase', 'QR Scanner'],
    url: 'https://github.com/DevNicolas01',
    display: 'github.com/DevNicolas01',
    c1: '#7c3aed',
    c2: '#db2777',
  },
  {
    type: 'landing page',
    name: 'Bistrô',
    description: 'Landing page elegante para restaurante, com cardápio e informações de contato.',
    tags: ['HTML', 'Tailwind', 'Vite', 'JavaScript'],
    url: 'https://github.com/DevNicolas01',
    display: 'github.com/DevNicolas01',
    c1: '#92400e',
    c2: '#f59e0b',
  },
  {
    type: 'landing page',
    name: 'Surf',
    description: 'Landing page moderna para marca de surf, com galeria e seção de produtos.',
    tags: ['HTML', 'Tailwind', 'Vite', 'JavaScript'],
    url: 'https://github.com/DevNicolas01',
    display: 'github.com/DevNicolas01',
    c1: '#0369a1',
    c2: '#22d3ee',
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
  return (
    <a
      className="project reveal"
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ['--d' as string]: `${i * 0.1}s` }}
      onMouseMove={tilt}
      onMouseLeave={untilt}
    >
      <div className="tilt">
        <div className="browser">
          <div className="bar">
            <i />
            <i />
            <i />
            <em>{p.display}</em>
          </div>
          <div className="shot" style={{ ['--c1' as string]: p.c1, ['--c2' as string]: p.c2 }}>
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
            <span className="visit">Visitar ↗</span>
          </div>
        </div>
        <div className="info">
          <div className="type">{p.type}</div>
          <h3>
            {p.name} <span className="arr">↗</span>
          </h3>
          <p>{p.description}</p>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
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
            Sites que estão <span className="em">no ar</span> trabalhando.
          </h2>
          <p className="lead">Projetos reais, de clientes do segmento de limpeza. Passe o mouse e clique para visitar.</p>
        </div>
        <div className="projects">
          {featured.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </div>
        <h3 className="sub-title reveal">Estudos e projetos pessoais</h3>
        <div className="projects">
          {studies.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
