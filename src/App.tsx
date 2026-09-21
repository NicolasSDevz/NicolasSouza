import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Zeus from './components/Zeus'
import Hud from './components/Hud'
import { scramble } from './scramble'
import Background from './components/Background'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Services from './components/Services'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    // títulos "decifrando" quando entram na tela
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const sio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            scramble(e.target as HTMLElement)
            sio.unobserve(e.target)
          }
        }),
      { threshold: 0.6 }
    )
    if (!reduce) document.querySelectorAll('.h2, .cta-box h2, .feature h3, .sub-title, .label').forEach((el) => sio.observe(el))

    // botões magnéticos
    const cleanups: Array<() => void> = []
    if (matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const move = (e: PointerEvent) => {
          const b = el.getBoundingClientRect()
          const dx = (e.clientX - (b.left + b.width / 2)) * 0.3
          const dy = (e.clientY - (b.top + b.height / 2)) * 0.4
          el.style.transform = `translate(${dx}px, ${dy}px)`
        }
        const leave = () => (el.style.transform = '')
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    }
    return () => {
      io.disconnect()
      sio.disconnect()
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <>
      <Preloader />
      <Cursor />
      <Zeus />
      <Hud />
      <Background />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
