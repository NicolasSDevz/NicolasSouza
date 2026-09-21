const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

// Monograma "N" cuja última haste vira uma seta (alvo + flecha).
// `progress` (0–1) desenha o traço aos poucos; sem ele, aparece completo.
export default function Mark({ progress = 1 }: { progress?: number }) {
  const ring = 1 - clamp(progress)
  const n = 1 - clamp(progress / 0.85)
  const chev = 1 - clamp((progress - 0.85) / 0.15)
  return (
    <svg className="mark" viewBox="0 0 100 100" aria-hidden>
      <circle className="ring" cx="50" cy="50" r="46" />
      <circle
        className="prog"
        cx="50"
        cy="50"
        r="46"
        pathLength="1"
        transform="rotate(-90 50 50)"
        strokeDasharray="1"
        strokeDashoffset={ring}
      />
      <path className="n" d="M32 70V32L68 70V34" pathLength="1" strokeDasharray="1" strokeDashoffset={n} />
      <path className="chev" d="M57 43L68 30L79 43" pathLength="1" strokeDasharray="1" strokeDashoffset={chev} />
    </svg>
  )
}
