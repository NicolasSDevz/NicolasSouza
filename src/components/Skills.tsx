interface Skill {
  name: string
  icon: string
  highlight?: boolean
  invert?: boolean
}

const skills: Skill[] = [
  { name: 'JavaScript', icon: 'javascript/javascript-original', highlight: true },
  { name: 'TypeScript', icon: 'typescript/typescript-original', highlight: true },
  { name: 'React', icon: 'react/react-original', highlight: true },
  { name: 'Node.js', icon: 'nodejs/nodejs-original', highlight: true },
  { name: 'C#', icon: 'csharp/csharp-original', highlight: true },
  { name: '.NET', icon: 'dotnetcore/dotnetcore-original', highlight: true },
  { name: 'Expo', icon: 'expo/expo-original', invert: true },
  { name: 'Tailwind', icon: 'tailwindcss/tailwindcss-original' },
  { name: 'Vite', icon: 'vitejs/vitejs-original' },
  { name: 'Firebase', icon: 'firebase/firebase-plain' },
  { name: 'MySQL', icon: 'mysql/mysql-original' },
  { name: 'MongoDB', icon: 'mongodb/mongodb-original' },
  { name: 'Git', icon: 'git/git-original' },
  { name: 'GitHub', icon: 'github/github-original-wordmark', invert: true },
  { name: 'HTML5', icon: 'html5/html5-original' },
  { name: 'CSS3', icon: 'css3/css3-original' },
  { name: 'Docker', icon: 'docker/docker-original' },
  { name: 'Flutter', icon: 'flutter/flutter-original' },
  { name: 'Dart', icon: 'dart/dart-original' },
]

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
const half = Math.ceil(skills.length / 2)

function Row({ items, rev }: { items: Skill[]; rev?: boolean }) {
  return (
    <div className={'track' + (rev ? ' rev' : '')}>
      {[0, 1, 2, 3].flatMap((k) =>
        items.map((s) => (
          <div key={`${k}-${s.name}`} className={'pill' + (s.highlight ? ' hl' : '')}>
            <img
              src={`${BASE}/${s.icon}.svg`}
              alt={s.name}
              loading="lazy"
              style={{ filter: s.invert ? 'invert(1)' : 'none' }}
            />
            {s.name}
          </div>
        ))
      )}
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills">
      <div className="wrap reveal">
        <div className="label">
          <b>04</b> skills
        </div>
        <h2 className="h2">
          Stack do <span className="em">dia a dia.</span>
        </h2>
      </div>
      <div className="mrows">
        <Row items={skills.slice(0, half)} />
        <Row items={skills.slice(half)} rev />
      </div>
    </section>
  )
}
