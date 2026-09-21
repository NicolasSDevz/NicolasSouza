import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Zeus from './components/Zeus'
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
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <>
      <Preloader />
      <Cursor />
      <Zeus />
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
