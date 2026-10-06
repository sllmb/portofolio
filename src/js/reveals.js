/* ============================================================
   REVEALS — Toute la grammaire du scroll (Étape 4).
   1. Titres assemblés : chaque H2 se matérialise lettre par lettre
   2. Révélations : les blocs émergent du vide (fondu + 24px)
   3. Trajectoire des missions + ligne de timeline : tracées au scroll
   4. Points de timeline : s'allument à l'entrée dans le viewport
   Tout est désactivé proprement si prefers-reduced-motion.
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'expo.out'; // l'équivalent GSAP de notre courbe "apesanteur"

/* --- 1. Titres assemblés (Pack Spectacle C) ------------------
   On découpe le texte du H2 en <span class="ch"> par caractère,
   puis chaque lettre converge vers sa place. Appelé aussi après
   un changement de langue (le texte change → on redécoupe).    */
export function splitTitles() {
  document.querySelectorAll('h2[data-split]').forEach((h2) => {
    // Nettoyer les déclencheurs d'un éventuel découpage précédent
    // (changement de langue → le texte est remplacé → on redécoupe)
    ScrollTrigger.getAll().forEach((st) => { if (st.trigger === h2) st.kill(); });

    // Texte d'origine : la copie lisible si le titre est déjà découpé
    const sr = h2.querySelector('.sr-only');
    const text = (sr ? sr.textContent : h2.textContent).trim();
    h2.innerHTML = '';

    // Les lecteurs d'écran lisent la phrase entière, pas lettre par lettre
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = text;
    h2.appendChild(label);

    // Lettres regroupées par mot (insécable) : le retour à la ligne ne
    // tombe qu'entre deux mots, et la ponctuation reste collée au sien
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    text.split(/( +)/).forEach((part) => {
      if (!part) return;
      if (part.trim() === '') { visual.append(' '); return; }
      const word = document.createElement('span');
      word.className = 'word';
      for (const char of part) {
        const span = document.createElement('span');
        span.className = 'ch';
        span.textContent = char;
        word.appendChild(span);
      }
      visual.appendChild(word);
    });
    h2.appendChild(visual);

    if (reduced) return;

    gsap.from(h2.querySelectorAll('.ch'), {
      opacity: 0,
      y: 12,
      rotation: () => gsap.utils.random(-8, 8),
      duration: 0.7,
      ease: EASE,
      stagger: 0.03,
      scrollTrigger: { trigger: h2, start: 'top 85%', once: true },
    });
  });
}

/* --- 2. Révélations génériques --------------------------------
   data-reveal        → l'élément seul émerge
   data-reveal-group  → ses enfants émergent en cascade (100ms)  */
export function initReveals() {
  if (reduced) return;

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: EASE,
      // Rendre la main au CSS une fois arrivé : sinon le transform inline
      // de GSAP écrase le survol (soulèvement + inclinaison 3D des cartes)
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

/* --- 3. Lignes tracées au scroll -------------------------------
   La trajectoire (missions) et la ligne d'orbite (timeline)
   grandissent au rythme du scroll — réversible (scrub).         */
export function initLines() {
  ['.trajectory', '.timeline-line'].forEach((sel) => {
    const line = document.querySelector(sel);
    if (!line) return;

    if (reduced) return; // la ligne reste simplement visible

    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: line.parentElement,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.5, // léger amorti : la ligne "suit" le scroll en douceur
      },
    });
  });
}

/* --- 4. Points de timeline + mission active --------------------
   Chaque étape s'allume quand elle entre dans la zone de lecture.
   Sur mobile, la mission proche du centre devient .active
   (équivalent du hover desktop).                                 */
export function initSteps() {
  document.querySelectorAll('.timeline .step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 70%',
      onEnter: () => step.classList.add('active'),
      onLeaveBack: () => step.classList.remove('active'),
    });
  });

  if (matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.mission').forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => card.classList.toggle('active', self.isActive),
      });
    });
  }
}

/** À appeler après un changement de langue : les hauteurs ont pu bouger */
export function refresh() {
  ScrollTrigger.refresh();
}
