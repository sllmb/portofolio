/* ============================================================
   SOLAR — Le voyage vers le Soleil.
   Chaque section est une étape : on part de Neptune (le hero,
   loin et sombre) et on arrive au Soleil (le contact). En chemin :
   1. Une planète dessinée par section, avec sa distance au Soleil
      en unités astronomiques (UA) : le compteur du voyage
   2. Une parallaxe douce (la planète glisse plus lentement que le texte)
   3. La lumière du jour (.daylight) qui monte au fil du défilement
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

/* Une planète ronde : base + détails clippés + ombre côté haut-gauche */
const globe = (uid, base, details) => `
  <svg viewBox="0 0 200 200">
    <defs><clipPath id="${uid}"><circle cx="100" cy="100" r="80"/></clipPath></defs>
    <circle cx="100" cy="100" r="80" fill="${base}"/>
    <g clip-path="url(#${uid})">
      ${details}
      <circle cx="78" cy="70" r="104" fill="#05070D" opacity=".5"/>
    </g>
  </svg>`;

const DRAW = {
  /* Neptune : bleu profond, bandes à peine visibles, une tache sombre */
  neptune: (uid) => globe(uid, '#3E5FA8', `
    <rect x="0" y="70" width="200" height="10" fill="#5476C2" opacity=".5"/>
    <rect x="0" y="118" width="200" height="6" fill="#5476C2" opacity=".4"/>
    <ellipse cx="122" cy="132" rx="16" ry="8" fill="#2C4580"/>`),

  /* Saturne : anneau arrière, planète, puis la moitié avant de l'anneau */
  saturn: (uid) => `
    <svg viewBox="0 0 280 200">
      <defs>
        <clipPath id="${uid}"><circle cx="140" cy="100" r="62"/></clipPath>
        <clipPath id="${uid}-front"><rect x="0" y="100" width="280" height="100"/></clipPath>
      </defs>
      <g transform="rotate(-14 140 100)">
        <ellipse cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#D8C08A" stroke-width="10" opacity=".45"/>
        <ellipse cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#8E7A55" stroke-width="5" opacity=".6"/>
      </g>
      <circle cx="140" cy="100" r="62" fill="#C2A46C"/>
      <g clip-path="url(#${uid})">
        <rect x="60" y="74" width="160" height="9" fill="#A3864F" opacity=".7"/>
        <rect x="60" y="96" width="160" height="6" fill="#D6BC88"/>
        <rect x="60" y="116" width="160" height="10" fill="#A3864F" opacity=".55"/>
        <circle cx="122" cy="76" r="82" fill="#05070D" opacity=".5"/>
      </g>
      <g transform="rotate(-14 140 100)" clip-path="url(#${uid}-front)">
        <ellipse cx="140" cy="100" rx="128" ry="30" fill="none" stroke="#D8C08A" stroke-width="10" opacity=".55"/>
        <ellipse cx="140" cy="100" rx="104" ry="23" fill="none" stroke="#8E7A55" stroke-width="5" opacity=".7"/>
      </g>
    </svg>`,

  /* Jupiter : larges bandes ocre et la Grande Tache rouge */
  jupiter: (uid) => globe(uid, '#C08A5B', `
    <rect x="0" y="40" width="200" height="14" fill="#E2BE94"/>
    <rect x="0" y="62" width="200" height="12" fill="#9E6B44"/>
    <rect x="0" y="84" width="200" height="18" fill="#E7C9A3"/>
    <rect x="0" y="110" width="200" height="10" fill="#9E6B44" opacity=".8"/>
    <rect x="0" y="130" width="200" height="16" fill="#D9AE82"/>
    <rect x="0" y="152" width="200" height="8" fill="#9E6B44" opacity=".6"/>
    <ellipse cx="128" cy="124" rx="20" ry="11" fill="#A9543A"/>`),

  /* Mars : rouille, plaines sombres, calotte polaire */
  mars: (uid) => globe(uid, '#B5532F', `
    <ellipse cx="80" cy="104" rx="34" ry="16" fill="#8E3D22" opacity=".8"/>
    <ellipse cx="132" cy="130" rx="24" ry="12" fill="#8E3D22" opacity=".7"/>
    <ellipse cx="100" cy="166" rx="40" ry="12" fill="#EBD9D0" opacity=".7"/>`),

  /* La Terre : océans, terres, nuages, et Dakar en cyan.
     La Lune est une petite planète voisine, dessinée à part. */
  earth: (uid) => `
    <svg viewBox="0 0 260 200">
      <defs><clipPath id="${uid}"><circle cx="100" cy="100" r="80"/></clipPath>
            <clipPath id="${uid}-moon"><circle cx="226" cy="54" r="16"/></clipPath></defs>
      <circle cx="100" cy="100" r="80" fill="#2F6FB0"/>
      <g clip-path="url(#${uid})">
        <path d="M86 64 q22 -8 40 6 q10 14 4 30 q-6 18 -18 34 q-8 12 -14 4 q-4 -16 -10 -28 q-14 -4 -16 -22 q0 -16 14 -24z" fill="#5C9A5E"/>
        <path d="M60 52 q14 -10 26 -4 q-4 10 -18 12z" fill="#5C9A5E" opacity=".9"/>
        <ellipse cx="96" cy="58" rx="46" ry="5" fill="#fff" opacity=".22"/>
        <ellipse cx="120" cy="150" rx="40" ry="5" fill="#fff" opacity=".18"/>
        <circle cx="78" cy="70" r="104" fill="#05070D" opacity=".42"/>
      </g>
      <circle cx="82" cy="84" r="4" fill="#76D7E8"/>
      <circle cx="82" cy="84" r="9" fill="none" stroke="#76D7E8" stroke-width="1.2" opacity=".6"/>
      <circle cx="226" cy="54" r="16" fill="#B9BCC4"/>
      <g clip-path="url(#${uid}-moon)">
        <circle cx="221" cy="50" r="4" fill="#8F939C"/><circle cx="232" cy="60" r="3" fill="#8F939C"/>
        <circle cx="220" cy="44" r="22" fill="#05070D" opacity=".45"/>
      </g>
    </svg>`,

  /* Vénus : voile de nuages crème */
  venus: (uid) => globe(uid, '#E3C08A', `
    <path d="M10 80 q50 -14 100 0 t100 0" fill="none" stroke="#F2D8AC" stroke-width="10" opacity=".7"/>
    <path d="M10 118 q50 14 100 0 t100 0" fill="none" stroke="#C99E62" stroke-width="8" opacity=".6"/>`),

  /* Mercure : gris, criblé de cratères */
  mercury: (uid) => globe(uid, '#9C948C', `
    <circle cx="80" cy="96" r="12" fill="#7F776F"/><circle cx="124" cy="128" r="9" fill="#7F776F"/>
    <circle cx="112" cy="78" r="6" fill="#7F776F"/><circle cx="74" cy="138" r="7" fill="#7F776F"/>`),
};

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

function makeBody(name, uid) {
  const el = document.createElement('div');
  el.className = 'solar-body';
  el.dataset.body = name;
  el.setAttribute('aria-hidden', 'true');

  if (name === 'belt') { el.innerHTML = belt(); return el; }
  if (name === 'sun') { el.innerHTML = '<div class="sun-disc"></div>'; return el; }

  el.innerHTML = DRAW[name](uid);
  // L'étiquette : nom + distance au Soleil, traduite comme le reste du site
  const label = document.createElement('span');
  label.className = 'solar-label mono';
  label.dataset.i18n = 'solar.' + name;
  label.textContent = t('solar.' + name);
  el.appendChild(label);
  return el;
}

export function initSolar() {
  ROUTE.forEach(({ section, bodies }) => {
    const host = document.querySelector(section);
    if (!host) return;
    host.classList.add('has-solar');

    bodies.forEach((name, i) => {
      const body = makeBody(name, `solar-${name}-${i}`);
      host.appendChild(body);
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
