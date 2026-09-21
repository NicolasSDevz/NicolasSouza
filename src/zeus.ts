// Raio do easter egg (usado ao digitar "zeus" e pela paleta de comandos)
export function strike() {
  const wrap = document.createElement('div')
  wrap.innerHTML =
    '<div class="zeus-flash"></div>' +
    '<div class="zeus-bolt"><svg viewBox="0 0 140 800" preserveAspectRatio="none">' +
    '<path pathLength="1" d="M78 0 L48 250 L82 262 L34 520 L66 530 L22 800"/></svg></div>' +
    '<div class="zeus-tag">ZEUS</div>'
  document.body.append(wrap)
  setTimeout(() => wrap.remove(), 2200)
}
