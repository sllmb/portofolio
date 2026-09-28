/* ============================================================
   PLANETS — Les planètes emblèmes des missions.
   Chaque mission porte un <div class="mission-planet" data-planet="...">
   et ce module y injecte un SVG dessiné en pur code.

   La recette d'une planète (à retenir pour dessiner les vôtres) :
   1. Un cercle de base (la couleur du monde)
   2. Des détails CLIPPÉS dans ce cercle (bandes, cratères, calottes)
      → clipPath = "ne dessine que ce qui est à l'intérieur du cercle"
   3. L'ombre : un grand cercle sombre décalé en bas-droite, clippé
      lui aussi → crée le croissant de lumière venant du haut-gauche
   Trois formes seulement : cercle, ellipse, rectangle. C'est tout.
   ============================================================ */

const DRAW = {
  /* La géante gazeuse : bandes horizontales + anneau (Orion) */
  gas: (uid) => `
    <svg viewBox="0 0 140 140" aria-hidden="true">
      <defs><clipPath id="${uid}"><circle cx="70" cy="70" r="40"/></clipPath></defs>
      <ellipse cx="70" cy="70" rx="64" ry="15" transform="rotate(-16 70 70)"
               fill="none" stroke="#76D7E8" stroke-width="2" opacity=".28"/>
      <ellipse cx="70" cy="70" rx="56" ry="12" transform="rotate(-16 70 70)"
               fill="none" stroke="#3D5380" stroke-width="1.5" opacity=".5"/>
      <circle cx="70" cy="70" r="40" fill="#2E3F66"/>
      <g clip-path="url(#${uid})">
        <rect x="26" y="52" width="88" height="7" fill="#3D5380" opacity=".8"/>
        <rect x="26" y="67" width="88" height="5" fill="#22304F"/>
        <rect x="26" y="80" width="88" height="8" fill="#3D5380" opacity=".6"/>
        <rect x="26" y="96" width="88" height="5" fill="#22304F"/>
        <circle cx="84" cy="82" r="50" fill="#05070D" opacity=".45"/>
      </g>
    </svg>`,

  /* La rocheuse : des cratères = des cercles plus sombres (Lyra) */
  rocky: (uid) => `
    <svg viewBox="0 0 140 140" aria-hidden="true">
      <defs><clipPath id="${uid}"><circle cx="70" cy="70" r="40"/></clipPath></defs>
      <circle cx="70" cy="70" r="40" fill="#1F2B47"/>
      <g clip-path="url(#${uid})">
        <circle cx="58" cy="56" r="7" fill="#15203A"/>
        <circle cx="82" cy="80" r="10" fill="#15203A"/>
        <circle cx="54" cy="86" r="5" fill="#15203A"/>
        <circle cx="84" cy="52" r="4" fill="#15203A"/>
        <circle cx="82" cy="82" r="50" fill="#05070D" opacity=".45"/>
      </g>
    </svg>`,

  /* La planète de glace : calottes polaires + courant cyan (Vega) */
  ice: (uid) => `
    <svg viewBox="0 0 140 140" aria-hidden="true">
      <defs><clipPath id="${uid}"><circle cx="70" cy="70" r="40"/></clipPath></defs>
      <circle cx="70" cy="70" r="40" fill="#2B4A6F"/>
      <g clip-path="url(#${uid})">
        <ellipse cx="70" cy="36" rx="34" ry="12" fill="#A8D8E8" opacity=".55"/>
        <ellipse cx="70" cy="106" rx="30" ry="10" fill="#A8D8E8" opacity=".4"/>
        <path d="M32 72 Q50 62 70 72 T112 70" fill="none"
              stroke="#76D7E8" stroke-width="2" opacity=".3"/>
        <circle cx="82" cy="82" r="50" fill="#05070D" opacity=".45"/>
      </g>
    </svg>`,
};

export function initPlanets() {
  document.querySelectorAll('.mission-planet').forEach((slot, i) => {
    const type = slot.dataset.planet;
    // L'identifiant unique évite les collisions de clipPath
    // si deux missions utilisent le même type de planète
    if (DRAW[type]) slot.innerHTML = DRAW[type]('planet-clip-' + i);
  });
}
