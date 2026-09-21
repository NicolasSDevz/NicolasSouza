import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    const d = dot.current!
    const r = ring.current!
    document.body.classList.add('has-cursor')
    let x = 0
    let y = 0
    let rx = 0
    let ry = 0
    let raf = 0
    // o loop só roda enquanto o anel ainda está alcançando o ponto
    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      d.style.transform = `translate3d(${x}px,${y}px,0)`
      d.classList.add('show')
      r.classList.add('show')
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const over = (e: PointerEvent) => {
      r.classList.toggle('hover', !!(e.target as Element).closest('a,button'))
    }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerover', over, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', move)
      removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}>
        <i />
      </div>
    </>
  )
}
