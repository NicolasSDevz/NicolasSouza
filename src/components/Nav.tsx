import { useEffect, useState } from 'react'
import { go } from '../hooks'
import Mark from './Mark'
import { scramble } from '../scramble'

const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'
const canMotion = !matchMedia('(prefers-reduced-motion: reduce)').matches

const items = [
  ['sobre', 'Sobre'],
  ['atuacao', 'Atuação'],
  ['projetos', 'Projetos'],
  ['skills', 'Skills'],
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    items.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    let last = scrollY
    const onScroll = () => {
      setHide(scrollY > last && scrollY > 200)
      last = scrollY
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav className={'nav' + (hide ? ' hide' : '')}>
      <a className="logo" href="#top" aria-label="Nicolas Souza, início">
        <Mark />
        <span className="logo-text">
          <b>Nicolas Souza</b>
          <small>Full Stack Dev</small>
        </span>
      </a>
      <div className="nav-links">
        {items.map(([id, label]) => (
          <button
            key={id}
            className={active === id ? 'active' : ''}
            onClick={() => go(id)}
            onMouseEnter={(e) => canMotion && scramble(e.currentTarget)}
          >
            {label}
          </button>
        ))}
        <button className="kbd" onClick={() => dispatchEvent(new Event('open-palette'))} aria-label="Abrir paleta de comandos">
          {mod} K
        </button>
        <a
          className="cta"
          href="#contato"
          onClick={(e) => {
            e.preventDefault()
            go('contato')
          }}
        >
          Contato
        </a>
      </div>
    </nav>
  )
}
