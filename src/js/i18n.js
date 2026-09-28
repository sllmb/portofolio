/* ============================================================
   I18N — Le bilinguisme FR/EN.
   Principe : chaque élément traduisible porte un attribut
   data-i18n="clé.du.texte". On remplace son contenu par la
   valeur du dictionnaire de la langue active.
   - Détection : choix mémorisé > langue du navigateur > FR
   - Le choix est conservé dans localStorage
   - L'attribut <html lang="..."> est mis à jour (lecteurs d'écran)
   ============================================================ */
import fr from '../i18n/fr.json';
import en from '../i18n/en.json';

const DICTS = { fr, en };

export function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && DICTS[saved]) return saved;
  return (navigator.language || 'fr').startsWith('fr') ? 'fr' : 'en';
}

export function applyLang(lang) {
  const dict = DICTS[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);

  // Remplacer le texte de chaque élément marqué
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value !== undefined) el.textContent = value;
  });

  // Mettre à jour l'état visuel du sélecteur FR/EN
  document.querySelectorAll('.lang button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

export function initLangSwitcher(onChange) {
  document.querySelectorAll('.lang button').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
      if (onChange) onChange(btn.dataset.lang);
    });
  });
}

/** Petit utilitaire pour récupérer une traduction depuis le JS (formulaire...) */
export function t(key) {
  const lang = document.documentElement.lang || 'fr';
  return (DICTS[lang] && DICTS[lang][key]) || key;
}
