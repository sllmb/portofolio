/* ============================================================
   PRELOADER — La séquence d'initialisation (Pack Spectacle B).
   Lignes de console qui défilent + compteur 0→100%, puis fondu.
   Retourne une Promise : main.js attend sa résolution pour
   lancer la séquence d'étoiles du hero.
   Détails :
   - 2e visite dans la même session → version express (300ms)
   - prefers-reduced-motion → aucun délai du tout
   ============================================================ */
export function runPreloader(lang) {
  const overlay = document.getElementById('preloader');
  const linesEl = overlay.querySelector('.preloader-lines');
  const counterEl = overlay.querySelector('.preloader-counter');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revisit = sessionStorage.getItem('visited') === '1';
  sessionStorage.setItem('visited', '1');

  // La fiction : un check-up de systèmes avant le décollage
  const LINES = [
    'SYSTÈMES........<span class="ok">OK</span>',
    'NAVIGATION......<span class="ok">OK</span>',
    `LANGUE..........<span class="ok">${lang.toUpperCase()}</span>`,
    'DÉCOLLAGE.......<span class="ok">IMMINENT</span>',
  ];

  return new Promise((resolve) => {
    function finish() {
      overlay.classList.add('done');
      document.body.classList.add('is-ready'); // déclenche la séquence hero (CSS)
      // Retirer l'overlay du flux une fois le fondu terminé
      setTimeout(() => overlay.remove(), 700);
      resolve();
    }

    // Pas d'animation demandée, ou revisite → on passe vite
    if (reduced) { finish(); return; }
    if (revisit) { setTimeout(finish, 300); return; }

    const DURATION = 1500; // 1,5s : assez pour la fiction, jamais frustrant
    const start = performance.now();

    // Le compteur 0→100%, synchronisé sur le temps réel
    function tick(now) {
      const p = Math.min(1, (now - start) / DURATION);
      counterEl.textContent = Math.round(p * 100) + '%';

      // Révéler les lignes au fil de la progression
      const linesToShow = Math.floor(p * LINES.length + 0.999);
      linesEl.innerHTML = LINES.slice(0, linesToShow).join('<br>');

      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finish, 250); // une respiration avant le fondu
    }
    requestAnimationFrame(tick);
  });
}
