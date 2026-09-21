import { useEffect, useState } from 'react'
import { go } from '../hooks'
import Mark from './Mark'

const items = [
  ['sobre', 'Sobre'],
  ['arrow-shot', 'Arrow Shot'],
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
          <small>Dev · Marketing</small>
        </span>
      </a>
      <div className="nav-links">
        {items.map(([id, label]) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)}>
            {label}
          </button>
        ))}
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
