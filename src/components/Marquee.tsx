const items = [
  'Limpeza pós-obra',
  'Sites de alta conversão',
  'Google Ads',
  'Meta Ads',
  'SEO local',
  'React & Node.js',
  'Landing pages',
  'Rastreamento',
]

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden>
      <div className="track">
        {[0, 1].flatMap((k) => items.map((t, i) => <span key={`${k}-${i}`}>{t}</span>))}
      </div>
    </div>
  )
}
