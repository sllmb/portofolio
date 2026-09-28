/* ============================================================
   NAV — La navigation intelligente.
   1. Fond + blur après 80px de scroll
   2. Se cache quand on descend, réapparaît quand on remonte
   3. Marque la section active (IntersectionObserver)
   4. Menu plein écran mobile
   5. Clic sur une ancre → saut en WARP (via le starfield)
   6. Premier scroll quittant le hero → impulsion de warp
   ============================================================ */
export function initNav(starfield) {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links = document.querySelectorAll('.nav-links a');

  // --- 1 & 2 : comportement au scroll --------------------------
  let lastY = scrollY;
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 80);
    // Cacher en descendant (après 200px), montrer en remontant
    if (scrollY > 200 && scrollY > lastY) nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    lastY = scrollY;
  }, { passive: true });

  // --- 3 : section active ---------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' }); // "actif" = au centre de l'écran
  sections.forEach((s) => observer.observe(s));

  // --- 4 : menu mobile -------------------------------------------
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // --- 5 : ancres en warp ----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      starfield.warpTo(target);
    });
  });

  // --- 6 : impulsion de warp au premier scroll quittant le hero ---
  let burstDone = false;
  addEventListener('scroll', () => {
    if (!burstDone && scrollY > innerHeight * 0.25) {
      burstDone = true;
      starfield.warpBurst();
    }
  }, { passive: true });
}
