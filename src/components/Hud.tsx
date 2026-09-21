import { useEffect, useRef } from 'react'

const sections: Array<[string, string]> = [
  ['top', 'home'],
  ['sobre', 'sobre'],
  ['atuacao', 'atuacao'],
  ['projetos', 'projetos'],
  ['skills', 'skills'],
  ['contato', 'contato'],
]

// Mini terminal fixo no canto: porcentagem de scroll e seção atual.
export default function Hud() {
  const pct = useRef<HTMLElement>(null)
  const sec = useRef<HTMLElement>(null)

  useEffect(() => {
    let raf = 0
    let lastP = ''
    let lastS = ''
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = String(Math.round((max > 0 ? scrollY / max : 0) * 100)).padStart(3, '0')
      let name = sections[0][1]
      for (const [id, label] of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) name = label
      }
      if (p !== lastP) pct.current!.textContent = lastP = p
      if (name !== lastS) sec.current!.textContent = lastS = name
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="hud" aria-hidden>
      <span className="pr">~/nicolas</span> $ scroll <b ref={pct}>000</b>% · <span ref={sec}>home</span>
      <i />
    </div>
  )
}
