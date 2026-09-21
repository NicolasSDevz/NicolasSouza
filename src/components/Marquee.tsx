const items = ['React', 'TypeScript', 'Node.js', '.NET', 'Expo', 'Firebase', 'MySQL', 'MongoDB']

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden>
      <div className="track">
        {[0, 1].flatMap((k) => [...items, ...items].map((t, i) => <span key={`${k}-${i}`}>{t}</span>))}
      </div>
    </div>
  )
}
