import { useEffect, useMemo, useRef, useState } from 'react'
import { go } from '../hooks'
import { ACCENTS, applyAccent } from '../theme'
import { strike } from '../zeus'

const EMAIL = 'nicolasouzaxx@gmail.com'
const openUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

interface Cmd {
  group: string
  title: string
  icon: string
  kw?: string
  secret?: boolean
  run: () => void
}

// Paleta de comandos (Ctrl/⌘ + K ou "/"): navegação, links, tema e um comando secreto.
export default function Palette() {
  const [show, setShow] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const close = () => {
    setShow(false)
    setQ('')
    setIdx(0)
  }
  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 1800)
  }

  const cmds = useMemo<Cmd[]>(
    () => [
      { group: 'Ir para', icon: '→', title: 'Início', kw: 'home topo', run: () => go('top') },
      { group: 'Ir para', icon: '→', title: 'Sobre', run: () => go('sobre') },
      { group: 'Ir para', icon: '→', title: 'Atuação', run: () => go('atuacao') },
      { group: 'Ir para', icon: '→', title: 'Arquitetura', kw: 'stack showcase deploy', run: () => go('showcase') },
      { group: 'Ir para', icon: '→', title: 'Projetos', kw: 'deal shot', run: () => go('projetos') },
      { group: 'Ir para', icon: '→', title: 'Skills', kw: 'tecnologias stack', run: () => go('skills') },
      { group: 'Ir para', icon: '→', title: 'Contato', run: () => go('contato') },
      {
        group: 'Contato',
        icon: '↗',
        title: 'Abrir WhatsApp',
        kw: 'zap conversar falar',
        run: () => openUrl('https://wa.me/5551998058521?text=Ol%C3%A1%20Nicolas!'),
      },
      { group: 'Contato', icon: '↗', title: 'Enviar e-mail', kw: 'email gmail', run: () => (location.href = `mailto:${EMAIL}`) },
      {
        group: 'Contato',
        icon: '⧉',
        title: 'Copiar e-mail',
        kw: 'email copiar',
        run: () => {
          navigator.clipboard?.writeText(EMAIL).then(() => flash('E-mail copiado ✓'))
        },
      },
      { group: 'Links', icon: '↗', title: 'LinkedIn', run: () => openUrl('https://www.linkedin.com/in/nicolas-souza-816781344/') },
      { group: 'Links', icon: '↗', title: 'GitHub', run: () => openUrl('https://github.com/DevNicolas01') },
      { group: 'Sites no ar', icon: '↗', title: 'limpezatecnica.com.br', kw: 'limpeza técnica', run: () => openUrl('https://limpezatecnica.com.br/') },
      { group: 'Sites no ar', icon: '↗', title: 'dcservicosba.com.br', kw: 'donna clean', run: () => openUrl('https://dcservicosba.com.br/') },
      { group: 'Sites no ar', icon: '↗', title: 'impactuslimpeza.com.br', kw: 'impactus', run: () => openUrl('https://impactuslimpeza.com.br/') },
      ...Object.keys(ACCENTS).map<Cmd>((name) => ({
        group: 'Tema',
        icon: '◐',
        title: `Cor: ${name}`,
        kw: 'tema cor accent',
        run: () => applyAccent(name),
      })),
      { group: 'Segredo', icon: '⚡', title: 'zeus', secret: true, run: () => setTimeout(strike, 150) },
    ],
    []
  )

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return cmds.filter((c) => (c.secret ? t === 'zeus' : !t || `${c.title} ${c.kw ?? ''} ${c.group}`.toLowerCase().includes(t)))
  }, [q, cmds])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShow((s) => !s)
      } else if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setShow(true)
      }
    }
    const open = () => setShow(true)
    addEventListener('keydown', key)
    addEventListener('open-palette', open)
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('open-palette', open)
    }
  }, [])

  useEffect(() => {
    if (show) input.current?.focus()
  }, [show])
  useEffect(() => setIdx(0), [q])
  useEffect(() => {
    document.querySelector('.pi.on')?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  if (!show) return null

  const run = (c?: Cmd) => {
    if (!c) return
    c.run()
    if (c.group !== 'Tema' && c.title !== 'Copiar e-mail') close()
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(i + 1, list.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') run(list[idx])
  }

  return (
    <div className="pal-back" onMouseDown={(e) => e.target === e.currentTarget && close()} role="dialog" aria-modal="true" aria-label="Paleta de comandos">
      <div className="pal">
        <div className="pal-in">
          <span>{'>'}</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="digite um comando… (projetos, whatsapp, cor azul)"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd>esc</kbd>
        </div>
        <div className="pal-list">
          {list.length === 0 && <div className="pal-empty">nenhum comando encontrado</div>}
          {list.map((c, i) => (
            <div key={c.group + c.title}>
              {(i === 0 || list[i - 1].group !== c.group) && <div className="pg">{c.group}</div>}
              <button className={'pi' + (i === idx ? ' on' : '')} onMouseMove={() => setIdx(i)} onClick={() => run(c)}>
                <span className="pic">{c.icon}</span>
                {c.title}
              </button>
            </div>
          ))}
        </div>
        <div className="pal-foot">{msg || '↑↓ navegar · ↵ executar · esc fechar'}</div>
      </div>
    </div>
  )
}
