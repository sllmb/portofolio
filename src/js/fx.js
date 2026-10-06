/* ============================================================
   FX — La couche "Pack Spectacle 2" : micro-interactions et
   animations supplémentaires.
   1. Curseur halo (desktop) : un anneau qui suit la souris avec retard
   2. Boutons magnétiques : attirés par le curseur
   3. Cartes de mission en 3D : inclinaison + reflet + planète en profondeur
   4. Barre de progression du voyage (scroll)
   5. Hero : le contenu s'éloigne en parallax quand on quitte le décollage
   6. Rôle décodé : le titre de poste se "déchiffre" comme sur une console
   7. Cascades : compétences et étapes du parcours glissent en place
   Tout est désactivé si prefers-reduced-motion ; 1-3 seulement
   sur les appareils à souris (pointer: fine).
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const EASE = 'expo.out';

/* --- 1. Curseur halo ------------------------------------------- */
function initCursor() {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);

  // quickTo : setter optimisé, idéal pour suivre la souris à chaque frame
  const toX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const toY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

  addEventListener('mousemove', (e) => {
    ring.classList.add('visible');
    toX(e.clientX);
    toY(e.clientY);
  });
  document.addEventListener('mouseleave', () => ring.classList.remove('visible'));

  // L'anneau grossit au survol des éléments interactifs
  const HOVER = 'a, button, input, textarea, .mission';
  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('hover', !!e.target.closest(HOVER));
  });
  addEventListener('mousedown', () => ring.classList.add('press'));
  addEventListener('mouseup', () => ring.classList.remove('press'));
}

/* --- 2. Boutons magnétiques ------------------------------------ */
function initMagnetic() {
  document.querySelectorAll('.btn, .nav-logo, .socials a').forEach((el) => {
    const STRENGTH = el.classList.contains('btn') ? 0.3 : 0.2;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { '--mx': dx * STRENGTH + 'px', '--my': dy * STRENGTH + 'px',
                    duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { '--mx': '0px', '--my': '0px', duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* --- 3. Cartes de mission en 3D --------------------------------- */
function initTilt() {
  document.querySelectorAll('.mission').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;  // 0..1
      const py = (e.clientY - r.top) / r.height;  // 0..1
      card.style.setProperty('--rx', ((0.5 - py) * 6).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((px - 0.5) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      // La planète "flotte" plus près de l'œil : elle bouge davantage
      card.style.setProperty('--tx', ((px - 0.5) * 14).toFixed(1) + 'px');
      card.style.setProperty('--ty', ((py - 0.5) * 14).toFixed(1) + 'px');
    });
    card.addEventListener('mouseleave', () => {
      ['--rx', '--ry', '--tx', '--ty'].forEach((p) => card.style.removeProperty(p));
    });
  });
}

/* --- 4. Barre de progression du voyage -------------------------- */
function initProgress() {
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  gsap.fromTo(bar, { scaleX: 0 }, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });
}

/* --- 5. Parallax de sortie du hero ------------------------------ */
function initHeroParallax() {
  const inner = document.querySelector('.hero-inner');
  if (!inner) return;
  gsap.to(inner, {
    y: 140,
    scale: 0.94,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* --- 6. Rôle décodé ----------------------------------------------
   Le titre de poste se "déchiffre" comme une console. Jamais le nom :
   c'est la seule chose qu'un recruteur doit pouvoir lire tout de suite.
   La ligne est en JetBrains Mono → largeur fixe, pas de tremblement.  */
export function decodeHeroRole() {
  const el = document.querySelector('.hero-title');
  if (!el || reduced) return;

  const final = el.textContent;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/';
  let written = final;
  // Pendant le brouillage, les lecteurs d'écran n'entendent pas le bruit
  el.setAttribute('aria-hidden', 'true');
  const done = () => el.removeAttribute('aria-hidden');

  const state = { p: 0 };
  const tween = gsap.to(state, {
    p: 1,
    duration: 0.9,
    delay: 0.35, // synchronisé avec l'apparition CSS de la ligne
    ease: 'power2.out',
    onUpdate() {
      // Changement de langue en cours de route : on laisse la main à i18n
      if (el.textContent !== written) { tween.kill(); done(); return; }
      const fixed = Math.floor(state.p * final.length);
      written = [...final].map((ch, i) => {
        if (i < fixed || /\s/.test(ch)) return ch; // espaces (insécables compris) intacts
        return GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }).join('');
      el.textContent = written;
    },
    onComplete() { el.textContent = final; done(); },
  });
}

/* --- 7. Cascades ------------------------------------------------ */
function initCascades() {
  document.querySelectorAll('.skills').forEach((list) => {
    gsap.from(list.children, {
      opacity: 0, x: -16, duration: 0.6, ease: EASE, stagger: 0.07,
      scrollTrigger: { trigger: list, start: 'top 85%', once: true },
    });
  });

  document.querySelectorAll('.timeline .step').forEach((step) => {
    gsap.from(step.querySelectorAll('.date, h3, p'), {
      opacity: 0, x: -24, duration: 0.7, ease: EASE, stagger: 0.08,
      scrollTrigger: { trigger: step, start: 'top 80%', once: true },
    });
  });
}

export function initFx() {
  if (reduced) return;
  initProgress();
  initHeroParallax();
  initCascades();
  if (fine) {
    initCursor();
    initMagnetic();
    initTilt();
  }
}
