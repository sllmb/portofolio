/* ============================================================
   MAIN — Le chef d'orchestre.
   Ordre de lancement :
   1. Styles
   2. Langue (avant tout affichage de texte)
   3. Préloader → à sa fin : allumage des étoiles + séquence hero
   4. Navigation, révélations, titres, lignes, formulaire
   Conseil de lecture du code : commencez ici, puis suivez les
   imports un par un (i18n → preloader → starfield → reveals…).
   ============================================================ */
import './styles/tokens.css';
import './styles/main.css';

import { detectLang, applyLang, initLangSwitcher } from './js/i18n.js';
import { runPreloader } from './js/preloader.js';
import { initStarfield } from './js/starfield.js';
import { splitTitles, initReveals, initLines, initSteps, refresh } from './js/reveals.js';
import { initNav } from './js/nav.js';
import { initForm } from './js/form.js';
import { initPlanets } from './js/planets.js';
import { initSolar } from './js/solar.js';
import { initFx, decodeHeroRole } from './js/fx.js';

// 1. Langue : appliquée immédiatement pour éviter tout "flash" de mauvais texte
const lang = detectLang();
applyLang(lang);

// 2. Le ciel : créé tout de suite (noir), allumé après le préloader
const starfield = initStarfield();

// 3. Préloader → séquence d'ouverture
runPreloader(lang).then(() => {
  starfield.start();
  decodeHeroRole();
});

// 4. Le reste du site (n'attend pas le préloader : tout est prêt sous l'overlay)
splitTitles();
initReveals();
initLines();
initSteps();
initNav(starfield);
initForm();
initPlanets();
initSolar();
initFx();

// 5. Changement de langue : on redécoupe les titres (le texte a changé)
//    et on recalcule les positions de scroll (les hauteurs ont pu bouger)
initLangSwitcher(() => {
  splitTitles();
  refresh();
});
