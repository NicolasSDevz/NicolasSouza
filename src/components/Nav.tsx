import { useEffect, useState } from 'react'

const items = [
  ['sobre', 'Sobre'],
  ['arrow-shot', 'Arrow Shot'],
  ['projetos', 'Projetos'],
  ['skills', 'Skills'],
]

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Nav() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    items.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className="nav">
      <a className="logo" href="#top">
        Nicolas<span>.Dev</span>
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
