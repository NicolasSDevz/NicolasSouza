const CHARS = '!<>-_\\/[]{}=+*^?#01'

// Efeito "decrypt": o texto aparece embaralhado e vai se resolvendo da esquerda para a direita.
// Altera só os nós de texto (mantém spans e estilos) e trava a altura para não pular o layout.
export function scramble(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const nodes: Array<{ n: Text; t: string }> = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue && n.nodeValue.trim()) nodes.push({ n: n as Text, t: n.nodeValue })
  }
  const total = nodes.reduce((a, x) => a + x.t.length, 0)
  if (!total) return

  el.style.minHeight = el.offsetHeight + 'px'
  const t0 = performance.now()
  const dur = Math.min(450 + total * 16, 1200)

  const tick = (now: number) => {
    const p = Math.min((now - t0) / dur, 1)
    const done = Math.floor(p * total)
    let idx = 0
    for (const { n, t } of nodes) {
      let out = ''
      for (const ch of t) {
        out += ch === ' ' || idx < done ? ch : CHARS[(Math.random() * CHARS.length) | 0]
        idx++
      }
      n.nodeValue = out
    }
    if (p < 1) requestAnimationFrame(tick)
    else el.style.minHeight = ''
  }
  requestAnimationFrame(tick)
}
