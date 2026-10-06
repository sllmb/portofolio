# Le Voyage Observé — Portfolio spatial

Portfolio one-page bilingue (FR/EN) au thème spatial.
Stack : **Vite + JavaScript vanilla + GSAP + Canvas 2D**.

## Démarrage rapide

```bash
# 1. Installer Node.js (≥ 18) : https://nodejs.org
# 2. Dans ce dossier :
npm install      # installe Vite et GSAP (une seule fois)
npm run dev      # serveur de développement → http://localhost:5173
npm run build    # version optimisée pour la production (dossier dist/)
npm run preview  # tester la version de production en local
```

## À personnaliser en priorité

1. **Votre nom** : dans `index.html` (`<h1 class="hero-name">`, footer), `meta.title` dans les fichiers i18n, et le logo `S·D` (initiales).
2. **Vos textes** : `src/i18n/fr.json` et `src/i18n/en.json` — tout le contenu y est centralisé.
3. **Le formulaire** : créez une clé gratuite sur [web3forms.com](https://web3forms.com) et remplacez `VOTRE_CLE_WEB3FORMS` dans `index.html`.
4. **Vos liens** : GitHub, LinkedIn, email (sections Missions et Contact).

## Carte du code (ordre de lecture conseillé)

| Fichier | Rôle | À lire pour apprendre |
|---|---|---|
| `src/main.js` | Chef d'orchestre | L'architecture en modules ES |
| `src/styles/tokens.css` | Design system | Les custom properties CSS |
| `src/styles/main.css` | Tous les styles | Layout, transitions, responsive |
| `src/js/i18n.js` | Bilinguisme | DOM + dictionnaires JSON |
| `src/js/preloader.js` | Séquence d'initialisation | Promises + requestAnimationFrame |
| `src/js/starfield.js` | Étoiles + warp | Canvas 2D + boucle d'animation |
| `src/js/reveals.js` | Animations au scroll | GSAP ScrollTrigger |
| `src/js/nav.js` | Navigation | IntersectionObserver |
| `src/js/form.js` | Contact | fetch + gestion d'erreurs |

## Les règles du design (à ne pas casser)

- **Cyan `#76D7E8` = max 5% de l'écran.** S'il est partout, il n'est nulle part.
- **3 durées d'animation** (300 / 600 / 1200ms), **1 easing signature** (`--ease-space`).
- On n'anime que `transform` et `opacity` (performance GPU).
- `prefers-reduced-motion` est toujours respecté — testez : le site doit rester beau sans aucune animation.

## Déploiement (gratuit)

1. Poussez le projet sur GitHub.
2. Sur [netlify.com](https://netlify.com) ou [vercel.com](https://vercel.com) : « Import project » → sélectionnez le dépôt.
3. Build command : `npm run build` — Publish directory : `dist`. C'est tout :
   chaque `git push` redéploiera automatiquement.

## Feuille de route V2

- Traversée horizontale des missions (GSAP pin + scrub)
- Curseur personnalisé magnétique (desktop)
- Carte de constellation dessinée pour les compétences (SVG interactif)
- Études de cas détaillées par mission (pages ou panneaux)
