export const ACCENTS: Record<string, string> = {
  vermelho: '255, 59, 59',
  verde: '200, 255, 46',
  azul: '59, 130, 255',
  laranja: '255, 140, 26',
  roxo: '168, 110, 255',
  branco: '237, 237, 238',
}

export function applyAccent(name: string) {
  const rgb = ACCENTS[name]
  if (!rgb) return
  document.documentElement.style.setProperty('--accent-rgb', rgb)
  try {
    localStorage.setItem('accent', name)
  } catch {
    /* sem storage: só não persiste */
  }
}

export function initAccent() {
  try {
    const saved = localStorage.getItem('accent')
    if (saved) applyAccent(saved)
  } catch {
    /* ignore */
  }
}
