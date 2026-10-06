import { defineConfig } from 'vite';

// En ligne, le site vit dans un sous-dossier : https://sllmb.github.io/portofolio/
// npm run preview reproduit la version en ligne : http://localhost:4173/portofolio/
// En développement (npm run dev), il reste à la racine : http://localhost:5173/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/portofolio/' : '/',
}));
