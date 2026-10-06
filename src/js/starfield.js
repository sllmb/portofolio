/* ============================================================
   STARFIELD — Le ciel étoilé en Canvas 2D.
   Responsabilités :
   1. Dessiner ~150 étoiles (70 sur mobile) sur 3 couches de profondeur
   2. Parallax souris (desktop) + parallax scroll (les couches lointaines
      défilent moins vite — illusion de profondeur)
   3. L'effet WARP : les étoiles s'étirent en traits pendant les sauts
   4. Densité décroissante : plus on approche du contact, moins d'étoiles
   5. Performance : pause hors-onglet, plafond de résolution, reduced-motion
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function initStarfield() {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches; // écran tactile ?

  // Plafonner le devicePixelRatio à 2 : au-delà, coût GPU sans gain visible
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
  }
  resize();
  addEventListener('resize', resize);

  // --- Création des étoiles ---------------------------------
  // Chaque étoile : position relative (0..1), profondeur z (0.2 / 0.5 / 1),
  // rayon, opacité de base, phase de scintillement, seuil de disparition.
  const COUNT = coarse ? 70 : 150;
  const LAYERS = [0.2, 0.5, 1]; // 0.2 = très loin, 1 = premier plan
  const stars = [];
  for (let i = 0; i < COUNT; i++) {
    const z = LAYERS[i % 3];
    stars.push({
      x: Math.random(),
      y: Math.random(),
      z,
      r: (0.5 + Math.random() * 0.9) * z, // les proches sont plus grosses
      a: 0.3 + Math.random() * 0.6,
      tw: Math.random() * Math.PI * 2,      // phase de scintillement
      birth: Math.random() * 1.4,            // délai d'apparition (séquence hero)
      fadeKey: Math.random(),                // seuil pour la densité décroissante
      cyan: Math.random() < 0.08,            // ~8% d'étoiles cyan
    });
  }

  // --- État global de l'animation ----------------------------
  let started = false;     // la séquence d'ouverture a-t-elle commencé ?
  let startTime = 0;
  let warpSpeed = 0;       // 0 = croisière, 1 = warp maximal
  const mouse = { tx: 0, ty: 0, x: 0, y: 0 }; // cible et position amortie

  if (!coarse) {
    addEventListener('mousemove', (e) => {
      // Normaliser en -0.5..0.5 par rapport au centre de l'écran
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = e.clientY / innerHeight - 0.5;
    });
  }

  // --- Étoiles filantes : une toutes les 5 à 12 secondes -------
  // Chaque météore : point de départ, direction, vitesse, durée de vie.
  const meteors = [];
  let nextMeteor = 3000; // la première arrive vite, après l'allumage
  function spawnMeteor(now) {
    const angle = (20 + Math.random() * 25) * Math.PI / 180; // vers le bas-droite
    meteors.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      vx: Math.cos(angle), vy: Math.sin(angle),
      speed: (0.9 + Math.random() * 0.6) * dpr, // px par ms
      len: (120 + Math.random() * 100) * dpr,
      born: now, life: 900 + Math.random() * 500,
    });
    nextMeteor = now + 5000 + Math.random() * 7000;
  }
  function drawMeteors(now) {
    if (started && now > nextMeteor && now - startTime > 2500) spawnMeteor(now);
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const t = now - m.born;
      if (t > m.life) { meteors.splice(i, 1); continue; }
      // Apparaît puis s'éteint (sinus sur la durée de vie)
      const fade = Math.sin((t / m.life) * Math.PI);
      const hx = m.x + m.vx * m.speed * t;
      const hy = m.y + m.vy * m.speed * t;
      const grad = ctx.createLinearGradient(hx, hy, hx - m.vx * m.len, hy - m.vy * m.len);
      grad.addColorStop(0, `rgba(233,238,246,${0.9 * fade})`);
      grad.addColorStop(0.3, `rgba(118,215,232,${0.4 * fade})`);
      grad.addColorStop(1, 'rgba(118,215,232,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - m.vx * m.len, hy - m.vy * m.len);
      ctx.stroke();
    }
  }

  // --- Rendu d'une frame --------------------------------------
  let drift = 0; // dérive automatique lente (remplace le parallax sur mobile)

  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    // Amortissement du parallax souris (lerp 0.05 = retard "flottant")
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    drift += 0.0006;

    // Progression du scroll (0 en haut → 1 en bas) pour la densité décroissante
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const density = 1 - progress * 0.6; // il reste 40% des étoiles à l'arrivée

    const elapsed = started ? (now - startTime) / 1000 : 0;

    for (const s of stars) {
      // Densité décroissante : chaque étoile a un seuil ; si la densité
      // passe dessous, elle s'éteint en douceur
      const visible = Math.min(1, Math.max(0, (density - s.fadeKey) * 8 + 1));
      if (visible <= 0) continue;

      // Apparition séquencée au chargement (1,4s d'allumage progressif)
      const birth = started ? Math.min(1, Math.max(0, (elapsed - s.birth) / 0.6)) : 0;
      if (birth <= 0) continue;

      // Scintillement perpétuel très lent
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(now / 900 + s.tw);

      // Position : parallax souris (desktop) ou dérive (mobile),
      // + parallax scroll (les couches lointaines bougent moins)
      const px = coarse ? Math.sin(drift + s.tw) * 6 * s.z
                        : -mouse.x * 24 * s.z;
      const py = coarse ? Math.cos(drift + s.tw) * 4 * s.z
                        : -mouse.y * 24 * s.z;
      const scrollOffset = scrollY * 0.12 * (1 - s.z); // le fond "retarde"
      const x = s.x * W + px * dpr;
      const y = ((s.y * H + scrollOffset * dpr + py * dpr) % H + H) % H;

      const alpha = s.a * twinkle * birth * visible;
      ctx.strokeStyle = ctx.fillStyle = s.cyan
        ? `rgba(118,215,232,${alpha})`
        : `rgba(233,238,246,${alpha})`;

      if (warpSpeed > 0.02) {
        // WARP : l'étoile devient un trait vertical (sens du voyage = scroll)
        const len = warpSpeed * (30 + 60 * s.z) * dpr;
        ctx.lineWidth = s.r * dpr;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - len);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, s.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduced) drawMeteors(now);
  }

  // --- Boucle d'animation, avec pauses de performance ---------
  let rafId = null;
  function loop(now) {
    draw(now);
    rafId = requestAnimationFrame(loop);
  }
  function play() { if (rafId === null && !reduced) rafId = requestAnimationFrame(loop); }
  function pause() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

  // Onglet masqué → on coupe tout (économie batterie)
  document.addEventListener('visibilitychange', () => {
    document.hidden ? pause() : play();
  });

  // --- API publique --------------------------------------------
  return {
    /** Démarre la séquence d'allumage des étoiles (appelé après le préloader) */
    start() {
      started = true;
      startTime = performance.now();
      if (reduced) {
        // Pas d'animation : on dessine une seule frame, toutes étoiles allumées
        startTime = -1e6;
        draw(performance.now());
        addEventListener('resize', () => draw(performance.now()));
        addEventListener('scroll', () => draw(performance.now()), { passive: true });
      } else {
        play();
      }
    },

    /** Saut hyperspatial vers une ancre : accélère, scrolle, décélère */
    warpTo(target, onArrive) {
      if (reduced) {
        gsap.to(window, { scrollTo: target, duration: 0, onComplete: onArrive });
        return;
      }
      const speed = coarse ? 0.6 : 1; // warp réduit sur mobile
      gsap.timeline()
        .to({}, { duration: 0.25, onUpdate() { warpSpeed = this.progress() * speed; } })
        .to(window, { scrollTo: { y: target, offsetY: 0 }, duration: 1, ease: 'power2.inOut',
                      onComplete: onArrive }, '<')
        .to({}, { duration: 0.5, onUpdate() { warpSpeed = (1 - this.progress()) * speed; },
                  ease: 'power2.out' });
    },

    /** Courte impulsion de warp (utilisée au premier scroll qui quitte le hero) */
    warpBurst() {
      if (reduced) return;
      gsap.timeline()
        .to({}, { duration: 0.3, onUpdate() { warpSpeed = this.progress() * 0.5; } })
        .to({}, { duration: 0.6, onUpdate() { warpSpeed = (1 - this.progress()) * 0.5; } });
    },
  };
}
