import { useEffect } from 'react'
import { strike } from '../zeus'

// Easter egg: uma falha quase invisível na logo, de vez em quando, e um raio ao digitar "zeus".
export default function Zeus() {
  useEffect(() => {
    console.log('%c⚡ zeus', 'color:#ff3b3b;font-weight:700;font-size:14px')

    let buf = ''
    const key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      buf = (buf + e.key.toLowerCase()).slice(-4)
      if (buf === 'zeus') {
        buf = ''
        strike()
      }
    }

    // falha rápida: o nome na logo vira "zeus" por ~70ms, duas vezes seguidas
    const flick = () => {
      const el = document.querySelector('.logo-text b')
      if (!el || document.hidden) return
      el.classList.add('zg')
      setTimeout(() => el.classList.remove('zg'), 70)
      setTimeout(() => el.classList.add('zg'), 150)
      setTimeout(() => el.classList.remove('zg'), 210)
    }
    let timer = 0
    const loop = () => {
      timer = window.setTimeout(() => {
        flick()
        loop()
      }, 25000 + Math.random() * 35000)
    }
    loop()

    addEventListener('keydown', key)
    return () => {
      clearTimeout(timer)
      removeEventListener('keydown', key)
    }
  }, [])
  return null
}
