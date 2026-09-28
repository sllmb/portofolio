/* ============================================================
   FORM — Le formulaire de contact (Web3Forms, sans backend).
   Pour l'activer : créez une clé gratuite sur web3forms.com
   et remplacez VOTRE_CLE_WEB3FORMS dans index.html.
   À l'envoi réussi : l'unique récompense animée du site,
   une étoile filante traverse l'écran.
   ============================================================ */
import { t } from './i18n.js';

export function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation simple côté client
    if (!form.checkValidity()) {
      status.textContent = t('contact.invalid');
      return;
    }

    button.disabled = true;
    status.textContent = t('contact.sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json();

      if (data.success) {
        status.textContent = t('contact.success');
        form.reset();
        shootStar(); // la récompense
      } else {
        throw new Error(data.message);
      }
    } catch {
      status.textContent = t('contact.error');
    } finally {
      button.disabled = false;
    }
  });
}

/** Une étoile filante unique, supprimée à la fin de son animation */
function shootStar() {
  const star = document.createElement('span');
  star.className = 'shooting-star';
  star.setAttribute('aria-hidden', 'true');
  document.body.appendChild(star);
  star.addEventListener('animationend', () => star.remove());
  // Si reduced-motion : aucune animation CSS ne joue → nettoyage de secours
  setTimeout(() => star.remove(), 2000);
}
