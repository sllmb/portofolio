/* ============================================================
   GALLERY — Les captures d'un projet.
   Chaque vignette (.shot-thumb) remplace la grande capture du
   cadre de navigateur : même image en deux tailles (srcset),
   description traduite (data-i18n-alt), vignette active marquée
   par aria-pressed. Un court fondu masque le changement.
   ============================================================ */
import { t } from './i18n.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initGallery() {
  document.querySelectorAll('.shot-thumbs').forEach((group) => {
    const img = group.previousElementSibling?.querySelector('img');
    if (!img) return;
    const thumbs = [...group.querySelectorAll('.shot-thumb')];

    thumbs.forEach((thumb) => {
      // Précharger la grande image au survol : le changement est instantané
      thumb.addEventListener('pointerenter', () => { new Image().src = thumb.dataset.shot + '.webp'; }, { once: true });

      thumb.addEventListener('click', () => {
        if (thumb.getAttribute('aria-pressed') === 'true') return;
        thumbs.forEach((b) => b.setAttribute('aria-pressed', String(b === thumb)));

        const base = thumb.dataset.shot;
        const swap = () => {
          img.srcset = `${base}-720.webp 720w, ${base}.webp 1200w`;
          img.src = base + '.webp';
          img.dataset.i18nAlt = thumb.dataset.alt;
          img.alt = t(thumb.dataset.alt);
        };
        if (reduced) { swap(); return; }
        img.classList.add('is-swapping');
        setTimeout(() => {
          swap();
          const show = () => img.classList.remove('is-swapping');
          if (img.complete) show();
          else {
            img.addEventListener('load', show, { once: true });
            img.addEventListener('error', show, { once: true });
          }
        }, 180);
      });
    });
  });
}
