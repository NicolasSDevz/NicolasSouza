export default function Contact() {
  return (
    <section id="contato">
      <div className="wrap">
        <div className="cta-box reveal">
          <div className="label" style={{ justifyContent: 'center' }}>contato</div>
          <h2>
            Vamos colocar sua empresa <span className="grad-text">no topo?</span>
          </h2>
          <p>
            Precisa de um site, campanhas ou um sistema sob medida? Fale comigo. Aberto também a oportunidades como
            desenvolvedor júnior.
          </p>
          <div className="row">
            <a className="btn primary" href="mailto:nicolasouzaxx@gmail.com">
              nicolasouzaxx@gmail.com <span className="arr">↗</span>
            </a>
            <a
              className="btn"
              href="https://www.linkedin.com/in/nicolas-souza-816781344/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span className="arr">↗</span>
            </a>
            <a className="btn" href="https://github.com/DevNicolas01" target="_blank" rel="noopener noreferrer">
              GitHub <span className="arr">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
