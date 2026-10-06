/* ============================================================
   SOLAR — Le voyage vers le Soleil.
   Chaque section est une étape : on part de Neptune (le hero,
   loin et sombre) et on arrive au Soleil (le contact). En chemin :
   1. Une planète dessinée par section, avec sa distance au Soleil
      en unités astronomiques (UA) : le compteur du voyage
   2. Une parallaxe douce (la planète glisse plus lentement que le texte)
   3. La lumière du jour (.daylight) qui monte au fil du défilement
   4. Chaque planète tourne sur elle-même, à sa vitesse (Vénus à l'envers),
      les anneaux de Saturne circulent, la Lune tourne autour de la Terre
   5. Des planètes interactives : survol (elle s'illumine), glisser
      (on pousse sa surface), clic (une fiche avec deux faits vrais
      et un bouton « Prochaine escale » qui saute en warp)
   Les planètes sont éclairées par le bas : la lumière vient du
   Soleil, qui est "devant" nous, plus bas dans la page.
   Même recette que planets.js : cercle de base, détails clippés,
   puis un grand cercle d'ombre décalé (ici vers le haut).
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { t } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* La rotation sur elle-même : la SURFACE défile sous l'ombre, qui reste
   fixe (la lumière vient toujours du Soleil). Le motif est répété trois
   fois sur une période P pour boucler sans couture ; solar.js déplace
   chaque .surface de "phase mod P" unités. */
const surface = (content, P = 200) => `
  <g class="surface" data-period="${P}">
    <g transform="translate(${-P} 0)">${content}</g><g>${content}</g><g transform="translate(${P} 0)">${content}</g>
  </g>`;

/* Une planète ronde : base + surface tournante clippée + ombre fixe */
const globe = (uid, base, details, lights = '') => `
  <svg viewBox="0 0 200 200">
    <defs><clipPath id="${uid}"><circle cx="100" cy="100" r="80"/></clipPath></defs>
    <circle cx="100" cy="100" r="80" fill="${base}"/>
    <g clip-path="url(#${uid})">
      ${surface(details)}
      <circle cx="78" cy="70" r="104" fill="#05070D" opacity=".5"/>
      ${lights ? surface(lights) : ''}
    </g>
  </svg>`;

const DRAW = {
  /* Neptune : bleu profond, bandes à peine visibles, la Grande Tache sombre
     et un nuage clair qui la suit */
  neptune: (uid) => globe(uid, '#3E5FA8', `
    <rect x="0" y="70" width="200" height="10" fill="#5476C2" opacity=".5"/>
    <rect x="0" y="118" width="200" height="6" fill="#5476C2" opacity=".4"/>
    <ellipse cx="122" cy="132" rx="16" ry="8" fill="#2C4580"/>
    <ellipse cx="146" cy="120" rx="10" ry="3" fill="#C9D6F2" opacity=".55"/>
    <ellipse cx="40" cy="96" rx="12" ry="5" fill="#2C4580" opacity=".7"/>`),

  /* Saturne : anneau arrière, planète (surface tournante), puis l'avant de l'anneau.
     Les particules des anneaux circulent : l'intérieur va plus vite (Kepler). */
  saturn: (uid) => `
    <svg viewBox="0 0 280 200">
      <defs>
        <clipPath id="${uid}"><circle cx="140" cy="100" r="62"/></clipPath>
        <clipPath id="${uid}-front"><rect x="0" y="100" width="280" height="100"/></clipPath>
      </defs>
      <g transform="rotate(-14 140 100)">
        <ellipse cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#D8C08A" stroke-width="10" opacity=".45"/>
        <ellipse cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#8E7A55" stroke-width="5" opacity=".6"/>
        <ellipse class="ring-flow" data-rate="1" cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#F1E2BC" stroke-width="7" stroke-dasharray="2 7 1 11 3 6 1.5 9" opacity=".55"/>
        <ellipse class="ring-flow" data-rate="1.6" cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#C9B48A" stroke-width="3.5" stroke-dasharray="1.5 6 3 8 1 5" opacity=".7"/>
      </g>
      <circle cx="140" cy="100" r="62" fill="#C2A46C"/>
      <g clip-path="url(#${uid})">
        ${surface(`
          <rect x="0" y="74" width="200" height="9" fill="#A3864F" opacity=".7"/>
          <rect x="0" y="96" width="200" height="6" fill="#D6BC88"/>
          <rect x="0" y="116" width="200" height="10" fill="#A3864F" opacity=".55"/>
          <ellipse cx="60" cy="88" rx="12" ry="4" fill="#E6D3A6" opacity=".8"/>
          <ellipse cx="150" cy="110" rx="9" ry="3" fill="#8E7A55" opacity=".6"/>`)}
        <circle cx="122" cy="76" r="82" fill="#05070D" opacity=".5"/>
      </g>
      <g transform="rotate(-14 140 100)" clip-path="url(#${uid}-front)">
        <ellipse cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#D8C08A" stroke-width="10" opacity=".55"/>
        <ellipse cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#8E7A55" stroke-width="5" opacity=".7"/>
        <ellipse class="ring-flow" data-rate="1" cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#F1E2BC" stroke-width="7" stroke-dasharray="2 7 1 11 3 6 1.5 9" opacity=".55"/>
        <ellipse class="ring-flow" data-rate="1.6" cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#C9B48A" stroke-width="3.5" stroke-dasharray="1.5 6 3 8 1 5" opacity=".7"/>
      </g>
    </svg>`,

  /* Jupiter : larges bandes ocre, la Grande Tache rouge et des ovales blancs */
  jupiter: (uid) => globe(uid, '#C08A5B', `
    <rect x="0" y="40" width="200" height="14" fill="#E2BE94"/>
    <rect x="0" y="62" width="200" height="12" fill="#9E6B44"/>
    <rect x="0" y="84" width="200" height="18" fill="#E7C9A3"/>
    <rect x="0" y="110" width="200" height="10" fill="#9E6B44" opacity=".8"/>
    <rect x="0" y="130" width="200" height="16" fill="#D9AE82"/>
    <rect x="0" y="152" width="200" height="8" fill="#9E6B44" opacity=".6"/>
    <ellipse cx="128" cy="124" rx="20" ry="11" fill="#A9543A"/>
    <ellipse cx="40" cy="70" rx="9" ry="4" fill="#F3E2C8" opacity=".85"/>
    <ellipse cx="70" cy="146" rx="7" ry="3" fill="#F3E2C8" opacity=".8"/>`),

  /* Mars : rouille, plaines sombres, calotte polaire (immobile, au pôle) */
  mars: (uid) => globe(uid, '#B5532F', `
    <ellipse cx="80" cy="104" rx="34" ry="16" fill="#8E3D22" opacity=".8"/>
    <ellipse cx="132" cy="130" rx="24" ry="12" fill="#8E3D22" opacity=".7"/>
    <ellipse cx="180" cy="90" rx="18" ry="9" fill="#8E3D22" opacity=".6"/>
    <rect x="0" y="160" width="200" height="30" fill="#EBD9D0" opacity=".65"/>`),

  /* La Terre : l'Afrique (avec Dakar en cyan) et les Amériques passent tour à
     tour. Le point Dakar est dans une 2e surface, au-dessus de l'ombre, pour
     rester lumineux. La Lune est un bouton à part qui tourne autour (voir orbit). */
  earth: (uid) => globe(uid, '#2F6FB0', `
    <path d="M86 64 q22 -8 40 6 q10 14 4 30 q-6 18 -18 34 q-8 12 -14 4 q-4 -16 -10 -28 q-14 -4 -16 -22 q0 -16 14 -24z" fill="#5C9A5E"/>
    <path d="M60 52 q14 -10 26 -4 q-4 10 -18 12z" fill="#5C9A5E" opacity=".9"/>
    <path d="M8 46 q18 -6 26 6 q-2 14 -12 20 q4 10 10 22 q6 18 0 34 q-8 8 -12 -6 q-6 -20 -10 -34 q-10 -10 -8 -24 q0 -12 6 -18z" fill="#5C9A5E"/>
    <ellipse cx="96" cy="58" rx="46" ry="5" fill="#fff" opacity=".22"/>
    <ellipse cx="160" cy="150" rx="40" ry="5" fill="#fff" opacity=".18"/>`, `
    <circle cx="82" cy="84" r="4" fill="#76D7E8"/>
    <circle cx="82" cy="84" r="9" fill="none" stroke="#76D7E8" stroke-width="1.2" opacity=".6"/>`),

  /* La Lune : grise, cratérisée. Elle tourne sur elle-même exactement une fois
     par tour de la Terre (rotation synchrone) : on voit toujours la même face. */
  moon: (uid) => globe(uid, '#B9BCC4', `
    <circle cx="70" cy="80" r="16" fill="#8F939C"/><circle cx="120" cy="120" r="12" fill="#8F939C"/>
    <circle cx="104" cy="62" r="8" fill="#9EA2AA"/><circle cx="150" cy="86" r="10" fill="#8F939C"/>
    <circle cx="30" cy="124" r="11" fill="#9EA2AA"/><circle cx="178" cy="132" r="7" fill="#8F939C"/>`),

  /* Vénus : voile de nuages crème (elle tourne à l'envers) */
  venus: (uid) => globe(uid, '#E3C08A', `
    <path d="M0 80 q50 -14 100 0 t100 0" fill="none" stroke="#F2D8AC" stroke-width="10" opacity=".7"/>
    <path d="M0 118 q50 14 100 0 t100 0" fill="none" stroke="#C99E62" stroke-width="8" opacity=".6"/>
    <ellipse cx="150" cy="98" rx="20" ry="5" fill="#F2D8AC" opacity=".6"/>`),

  /* Mercure : gris, criblé de cratères */
  mercury: (uid) => globe(uid, '#9C948C', `
    <circle cx="80" cy="96" r="12" fill="#7F776F"/><circle cx="124" cy="128" r="9" fill="#7F776F"/>
    <circle cx="112" cy="78" r="6" fill="#7F776F"/><circle cx="74" cy="138" r="7" fill="#7F776F"/>
    <circle cx="170" cy="110" r="10" fill="#7F776F"/><circle cx="22" cy="80" r="8" fill="#7F776F"/>`),
};

/* Vitesses de rotation : le temps (en secondes) pour un tour complet à
   l'écran. L'ordre suit les vraies durées du jour, compressées pour rester
   visibles : Jupiter 9 h 56 (la plus rapide) … Vénus 243 jours, et à
   l'envers (signe négatif) : c'est la seule planète qui tourne dans
   l'autre sens. */
const TURN = { jupiter: 16, saturn: 17, neptune: 24, earth: 34, mars: 35, mercury: 90, venus: -140, moon: 48 };

/* La ceinture d'astéroïdes, entre Jupiter et Mars : une bande de points */
function belt() {
  let dots = '';
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1000;
    const y = 30 + Math.sin(x / 160) * 12 + (Math.random() - 0.5) * 30;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + Math.random() * 2).toFixed(1)}"/>`;
  }
  return `<svg viewBox="0 0 1000 60" preserveAspectRatio="none">${dots}</svg>`;
}

/* Les étapes du voyage : section → corps célestes */
const ROUTE = [
  { section: '#hero',        bodies: ['neptune'] },
  { section: '#apropos',     bodies: ['saturn'] },
  { section: '#competences', bodies: ['jupiter'] },
  { section: '#missions',    bodies: ['belt', 'mars'] },
  { section: '#parcours',    bodies: ['earth'] },
  { section: '#contact',     bodies: ['venus', 'mercury', 'sun'] },
];

/* L'ordre des escales : chaque fiche propose la suivante.
   Le Soleil boucle sur le départ (le hero). */
const STOPS = ['neptune', 'saturn', 'jupiter', 'mars', 'earth', 'moon', 'venus', 'mercury', 'sun'];

function planetButton(name, uid) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'solar-planet' + (name === 'moon' ? ' solar-moon' : '');
  btn.dataset.planet = name;
  btn.dataset.ariaKey = 'planet.' + name + '.open';
  btn.setAttribute('aria-label', t('planet.' + name + '.open'));
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = name === 'sun' ? '<div class="sun-disc"></div>' : DRAW[name](uid);
  return btn;
}

function makeBody(name, uid) {
  const el = document.createElement('div');
  el.className = 'solar-body';
  el.dataset.body = name;

  if (name === 'belt') {
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = belt();
    return el;
  }

  // La planète est un vrai bouton : clavier, lecteurs d'écran, focus visible
  el.appendChild(planetButton(name, uid));
  // La Lune accompagne la Terre : même corps, donc même parallaxe
  if (name === 'earth') el.appendChild(planetButton('moon', uid + '-moon'));

  if (name !== 'sun') {
    // L'étiquette : nom + distance au Soleil, traduite comme le reste du site
    const label = document.createElement('span');
    label.className = 'solar-label mono';
    label.setAttribute('aria-hidden', 'true');
    label.dataset.i18n = 'solar.' + name;
    label.textContent = t('solar.' + name);
    el.appendChild(label);
  }
  return el;
}

/* --- La rotation : automatique + glisser + clavier -----------------
   Une seule boucle (gsap.ticker) fait avancer toutes les planètes
   visibles. Glisser pousse la surface sous le doigt, puis l'élan
   s'amortit. Un seul pointeur à la fois ; moins de 6 px = un clic.
   touch-action: pan-y (CSS) : un geste vertical fait défiler la page,
   le navigateur annule alors notre geste (pointercancel).          */
const spinners = [];
let tickerOn = false;

function tick(time, deltaTime) {
  const dt = Math.min(deltaTime, 64); // onglet repris : pas de saut géant
  for (const s of spinners) {
    if (!s.visible && !s.boost) continue;
    if (!reduced && !s.dragging) s.phase += (s.P / s.turn) * dt / 1000;
    s.phase += s.boost * dt;
    s.boost *= Math.pow(0.93, dt / 16.7);
    if (Math.abs(s.boost) < 0.001) s.boost = 0;
    s.apply();
  }
}

/* L'orbite de la Lune : une ellipse inclinée autour du centre de la Terre.
   Devant la Terre sur la moitié basse du trajet, derrière sur la moitié haute
   (la classe .is-behind la fait passer sous le bouton de la Terre). */
function makeOrbit(moon) {
  const body = moon.closest('.solar-body');
  const TILT = -12 * Math.PI / 180;
  const size = () => body.querySelector('.solar-planet').getBoundingClientRect().width;
  const fn = (turns) => {
    const a = turns * 2 * Math.PI;
    const w = size();
    const x0 = Math.cos(a) * w * 0.66, y0 = Math.sin(a) * w * 0.17;
    const x = x0 * Math.cos(TILT) - y0 * Math.sin(TILT);
    const y = x0 * Math.sin(TILT) + y0 * Math.cos(TILT);
    moon.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
    moon.classList.toggle('is-behind', Math.sin(a) < 0);
  };
  fn.rx = () => size() * 0.66;
  return fn;
}

function makeSpinnable(btn, name, onClick) {
  const art = btn.firstElementChild;
  const surfaces = [...art.querySelectorAll('.surface')];
  const P = Number(surfaces[0].dataset.period);
  const vbWidth = art.viewBox.baseVal.width;
  const rings = [...art.querySelectorAll('.ring-flow')];
  const orbit = name === 'moon' ? makeOrbit(btn) : null;
  const s = {
    P, turn: TURN[name], phase: Math.random() * P, boost: 0, visible: false, dragging: false,
    apply() {
      const x = ((s.phase % P) + P) % P;
      surfaces.forEach((g) => g.setAttribute('transform', `translate(${x.toFixed(2)} 0)`));
      // Anneaux : les particules avancent avec la rotation de la planète
      rings.forEach((r) => r.setAttribute('stroke-dashoffset', (-s.phase * r.dataset.rate).toFixed(1)));
      // Lune : un tour d'orbite = un tour sur elle-même (même phase)
      if (orbit) orbit(s.phase / P);
    },
  };
  s.apply();
  spinners.push(s);
  if (!tickerOn) { gsap.ticker.add(tick); tickerOn = true; }

  // On ne calcule que les planètes à l'écran
  new IntersectionObserver(([entry]) => { s.visible = entry.isIntersecting; }).observe(btn);

  // Unités du dessin par pixel à l'écran : la surface suit exactement le doigt
  const unitsPerPx = () => (orbit ? P / (2 * Math.PI * orbit.rx())
                                  : vbWidth / art.getBoundingClientRect().width);
  let drag = null;

  btn.addEventListener('pointerdown', (e) => {
    if (drag || e.button > 0) return; // un deuxième doigt est ignoré
    drag = { id: e.pointerId, x: e.clientX, last: e.clientX, t: performance.now(), v: 0, moved: false };
    try { btn.setPointerCapture(e.pointerId); } catch { /* pointeur déjà relâché */ }
  });

  btn.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.last;
    if (!drag.moved && Math.abs(e.clientX - drag.x) > 6) {
      drag.moved = true; s.dragging = true; s.boost = 0;
      btn.classList.add('is-dragging');
    }
    if (!drag.moved) return;
    const now = performance.now();
    const k = unitsPerPx();
    // Vitesse en unités par ms pour l'élan, plafonnée : un geste brusque ≈ un tour
    drag.v = Math.max(-0.6, Math.min(0.6, (dx * k) / Math.max(1, now - drag.t)));
    drag.last = e.clientX; drag.t = now;
    s.phase += dx * k;
    s.apply();
  });

  const end = (e, cancelled) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { moved, v } = drag;
    drag = null;
    s.dragging = false;
    btn.classList.remove('is-dragging');
    if (btn.hasPointerCapture(e.pointerId)) btn.releasePointerCapture(e.pointerId);
    if (!moved) { if (!cancelled) onClick(); return; }
    // L'élan : la planète continue un peu dans le sens du geste, puis ralentit
    if (!reduced) s.boost = v;
  };
  btn.addEventListener('pointerup', (e) => end(e, false));
  btn.addEventListener('pointercancel', (e) => end(e, true));
  btn.addEventListener('lostpointercapture', (e) => end(e, true));

  // Le clic au pointeur passe par pointerup ; seul le clic clavier passe ici
  btn.addEventListener('click', (e) => { if (e.detail === 0) onClick(); });

  // Clavier : les flèches donnent une impulsion de rotation
  btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    if (reduced) { s.phase += dir * 30; s.apply(); return; }
    s.boost += dir * 0.15;
  });
}

/* --- La fiche d'une planète -------------------------------------
   Un seul panneau, réutilisé. Non modal : la page reste utilisable.
   Il se ferme avec Échap, le bouton fermer, un clic ailleurs, ou si
   l'on s'éloigne en défilant. Le focus revient alors à la planète. */
const CLOSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

function makeCard(starfield) {
  const card = document.createElement('div');
  card.className = 'planet-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-labelledby', 'planet-card-title');
  card.hidden = true;
  card.innerHTML = `
    <button type="button" class="planet-card-close">${CLOSE_ICON}</button>
    <h3 id="planet-card-title" class="planet-card-title"></h3>
    <p class="planet-card-meta mono"></p>
    <ul class="planet-card-facts"></ul>
    <button type="button" class="btn btn-primary planet-card-next"></button>`;
  document.body.appendChild(card);

  const $ = (sel) => card.querySelector(sel);
  let current = null;   // le bouton de la planète ouverte
  let openedAt = 0;     // position de défilement à l'ouverture

  function place(btn) {
    if (innerWidth < 768) { card.style.left = card.style.top = ''; return; } // mobile : panneau en bas (CSS)
    const r = btn.getBoundingClientRect();
    const w = card.offsetWidth, h = card.offsetHeight;
    const gap = 20;
    // À gauche de la planète (elles sont à droite de l'écran), sinon à droite
    let left = r.left - w - gap;
    if (left < 16) left = Math.min(r.right + gap, innerWidth - w - 16);
    const top = Math.min(Math.max(16, r.top + r.height / 2 - h / 2), innerHeight - h - 16);
    card.style.left = left + 'px';
    card.style.top = top + 'px';
  }

  function open(name, btn) {
    if (current && current !== btn) current.setAttribute('aria-expanded', 'false');
    current = btn;
    openedAt = scrollY;
    // Prochaine escale visible (Mercure et Neptune sont masquées sur petit écran)
    const visible = (n) => document.querySelector(`.solar-planet[data-planet="${n}"]`)?.getClientRects().length > 0;
    const next = STOPS.slice(STOPS.indexOf(name) + 1).find(visible);
    $('.planet-card-title').textContent = t('planet.' + name + '.name');
    $('.planet-card-meta').textContent = t('planet.' + name + '.meta');
    const facts = $('.planet-card-facts');
    facts.innerHTML = '';
    ['f1', 'f2'].forEach((f) => {
      const li = document.createElement('li');
      li.textContent = t('planet.' + name + '.' + f);
      facts.appendChild(li);
    });
    const nextBtn = $('.planet-card-next');
    nextBtn.textContent = next ? `${t('planet.next')} ${t('planet.' + next + '.name')} →` : t('planet.back');
    nextBtn.onclick = () => {
      close(false);
      if (!next) {
        const hero = document.getElementById('hero');
        starfield.warpTo(hero, () => {
          if (!hero.hasAttribute('tabindex')) hero.setAttribute('tabindex', '-1');
          hero.focus({ preventScroll: true });
        });
        return;
      }
      const target = document.querySelector(`.solar-planet[data-planet="${next}"]`);
      const section = target.closest('section');
      // Escale dans la même section (Terre → Lune, Vénus → Mercure → Soleil) : on vise la planète
      const dest = section.contains(btn) ? target.closest('.solar-body') : section;
      // À l'arrivée, le focus va sur la planète suivante : on peut continuer au clavier
      starfield.warpTo(dest, () => target.focus({ preventScroll: true }));
    };
    $('.planet-card-close').setAttribute('aria-label', t('planet.close'));

    card.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    place(btn);
    card.classList.remove('is-open');
    void card.offsetWidth; // relancer l'animation d'entrée
    card.classList.add('is-open');
    nextBtn.focus({ preventScroll: true });
  }

  function close(restoreFocus = true) {
    if (card.hidden) return;
    card.hidden = true;
    card.classList.remove('is-open');
    if (current) {
      current.setAttribute('aria-expanded', 'false');
      if (restoreFocus) current.focus({ preventScroll: true });
    }
    current = null;
  }

  $('.planet-card-close').addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('pointerdown', (e) => {
    if (!card.hidden && !card.contains(e.target) && !e.target.closest('.solar-planet')) close(false);
  });
  addEventListener('scroll', () => { if (!card.hidden && Math.abs(scrollY - openedAt) > 160) close(false); }, { passive: true });
  addEventListener('resize', () => { if (current) place(current); });
  // Changement de langue : la fiche serait dans l'ancienne langue, et les
  // libellés des boutons-planètes ne portent pas data-i18n (ce sont des aria-label)
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    close(false);
    // Après le changement de langue (son écouteur est branché après celui-ci)
    setTimeout(() => {
      document.querySelectorAll('.solar-planet').forEach((p) => p.setAttribute('aria-label', t(p.dataset.ariaKey)));
    });
  }));

  return { open, close, isOpenFor: (btn) => current === btn };
}

export function initSolar(starfield) {
  const card = makeCard(starfield);

  ROUTE.forEach(({ section, bodies }) => {
    const host = document.querySelector(section);
    if (!host) return;
    host.classList.add('has-solar');

    bodies.forEach((name, i) => {
      const body = makeBody(name, `solar-${name}-${i}`);
      host.appendChild(body);

      body.querySelectorAll('.solar-planet').forEach((btn) => {
        const planet = btn.dataset.planet;
        const toggle = () => (card.isOpenFor(btn) ? card.close() : card.open(planet, btn));
        if (planet === 'sun') btn.addEventListener('click', toggle); // le Soleil ne tourne pas
        else makeSpinnable(btn, planet, toggle);
      });

      if (reduced) return; // sans parallaxe : la planète reste à sa place

      if (name === 'sun') {
        // Le Soleil se lève : il monte depuis le bas pendant qu'on arrive
        gsap.fromTo(body, { yPercent: 45 }, {
          yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
        return;
      }

      // Parallaxe : la planète glisse moins vite que le contenu (elle est loin)
      const depth = name === 'jupiter' ? 30 : name === 'belt' ? 10 : 22;
      gsap.fromTo(body, { yPercent: depth, rotation: -4 }, {
        yPercent: -depth, rotation: 4, ease: 'none',
        scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });

  // La lumière du jour : invisible en haut, pleine à l'arrivée au Soleil.
  // Ce n'est pas un mouvement (juste une couleur) : active même en reduced-motion.
  const daylight = document.querySelector('.daylight');
  if (daylight) {
    gsap.fromTo(daylight, { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: reduced ? true : 0.4 },
    });
  }
}
