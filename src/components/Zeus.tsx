import { useEffect } from 'react'

// Easter egg: uma falha quase invisível na logo, de vez em quando, e um raio ao digitar "zeus".
export default function Zeus() {
  useEffect(() => {
    console.log('%c⚡ zeus', 'color:#c8ff2e;font-weight:700;font-size:14px')

    const strike = () => {
      const wrap = document.createElement('div')
      wrap.innerHTML =
        '<div class="zeus-flash"></div>' +
        '<div class="zeus-bolt"><svg viewBox="0 0 140 800" preserveAspectRatio="none">' +
        '<path pathLength="1" d="M78 0 L48 250 L82 262 L34 520 L66 530 L22 800"/></svg></div>' +
        '<div class="zeus-tag">ZEUS</div>'
      document.body.append(wrap)
      setTimeout(() => wrap.remove(), 2200)
    }

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
