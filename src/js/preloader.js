/* ============================================================
   PRELOADER — La séquence d'initialisation (Pack Spectacle B).
   Lignes de console qui défilent + compteur 0→100%, puis fondu.
   Retourne une Promise : main.js attend sa résolution pour
   lancer la séquence d'étoiles du hero.
   Détails :
   - 2e visite dans la même session → version express (300ms)
   - prefers-reduced-motion → aucun délai du tout
   ============================================================ */
import { t } from './i18n.js';

export function runPreloader(lang) {
  const overlay = document.getElementById('preloader');
  const linesEl = overlay.querySelector('.preloader-lines');
  const counterEl = overlay.querySelector('.preloader-counter');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revisit = sessionStorage.getItem('visited') === '1';
  sessionStorage.setItem('visited', '1');

  // La fiction : un check-up de systèmes avant le décollage
  // Les points complètent chaque libellé à 16 caractères (alignement console)
  const line = (key, value) => t(key).padEnd(16, '.') + `<span class="ok">${value}</span>`;
  const LINES = [
    line('preloader.systems', 'OK'),
    line('preloader.nav', 'OK'),
    line('preloader.lang', lang.toUpperCase()),
    line('preloader.launch', t('preloader.imminent')),
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

    // 0,5s : juste le temps de lire le check-up. Un recruteur pressé
    // doit voir le nom en moins de 1,5s après l'arrivée.
    const DURATION = 500;
    const start = performance.now();

    // Le compteur 0→100%, synchronisé sur le temps réel
    function tick(now) {
      const p = Math.min(1, (now - start) / DURATION);
      counterEl.textContent = Math.round(p * 100) + '%';

      // Révéler les lignes au fil de la progression
      const linesToShow = Math.floor(p * LINES.length + 0.999);
      linesEl.innerHTML = LINES.slice(0, linesToShow).join('<br>');

      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finish, 120); // une respiration avant le fondu
    }
    requestAnimationFrame(tick);
  });
}
