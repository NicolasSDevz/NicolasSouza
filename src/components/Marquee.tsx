const items = [
  'Limpeza pós-obra',
  'Sites de alta conversão',
  'Google Ads',
  'Meta Ads',
  'SEO local',
  'React & Node.js',
  'Landing pages',
  'Arrow Shot',
]

export default function Marquee() {
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden>
      <div className="track">
        {[0, 1].flatMap((k) => row.map((t, i) => <span key={`${k}-${i}`}>{t}</span>))}
      </div>
    </div>
  )
}
