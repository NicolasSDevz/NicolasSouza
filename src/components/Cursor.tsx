import { useEffect, useRef } from 'react'

// Ponto neon: cresce em links/botões e mostra um rótulo (ex.: "VER") em elementos com data-cursor.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    const c = el.current!
    document.body.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      c.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`
      c.classList.add('show')
    }
    const over = (e: PointerEvent) => {
      const t = e.target as Element
      const tag = t.closest<HTMLElement>('[data-cursor]')
      if (tag) {
        label.current!.textContent = tag.dataset.cursor || ''
        c.classList.add('label')
        c.classList.remove('hover')
      } else {
        c.classList.remove('label')
        c.classList.toggle('hover', !!t.closest('a,button'))
      }
    }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerover', over, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      removeEventListener('pointermove', move)
      removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <div className="cur" ref={el}>
      <i />
      <b ref={label} />
    </div>
  )
}
