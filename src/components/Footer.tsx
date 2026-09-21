export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="wordmark" aria-hidden>
          Nicolas Souza
        </div>
        <div className="foot">
          <div>© {new Date().getFullYear()} Nicolas Souza · Feito com React, TypeScript e Vite</div>
          <button data-magnetic onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Voltar ao topo ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
