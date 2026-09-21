import { useState } from 'react'

const EMAIL = 'nicolasouzaxx@gmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contato">
      <div className="wrap">
        <div className="cta-box reveal">
          <div className="label">
            <b>05</b> contato
          </div>
          <h2>
            Vamos construir algo <span className="em">juntos?</span>
          </h2>
          <p>
            Tem um projeto, uma vaga ou uma ideia? Fale comigo. Estou aberto a oportunidades CLT como
            desenvolvedor júnior.
          </p>
          <div className="row">
            <a className="btn primary" data-magnetic href={`mailto:${EMAIL}`}>
              {EMAIL} <span className="arr">↗</span>
            </a>
            <button className="btn" data-magnetic onClick={copy}>
              Copiar e-mail
            </button>
            <a
              className="btn"
              data-magnetic
              href="https://www.linkedin.com/in/nicolas-souza-816781344/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span className="arr">↗</span>
            </a>
            <a
              className="btn"
              data-magnetic
              href="https://github.com/DevNicolas01"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span className="arr">↗</span>
            </a>
          </div>
        </div>
      </div>
      <div className={'toast' + (copied ? ' show' : '')}>E-mail copiado ✓</div>
    </section>
  )
}
