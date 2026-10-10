/* ============================================================
   FORM — Le formulaire de contact (Web3Forms, sans backend).
   Pour l'activer : créez une clé gratuite sur web3forms.com
   et remplacez VOTRE_CLE_WEB3FORMS dans index.html.
   À l'envoi réussi : l'unique récompense animée du site,
   une étoile filante traverse l'écran.
   Chaque champ affiche sa propre erreur, sous lui (aria-describedby),
   et l'email direct se copie en un clic.
   ============================================================ */
import { t } from './i18n.js';

/* Le message d'erreur d'un champ (clé i18n), ou null s'il est valide */
function errorKey(field) {
  const v = field.validity;
  if (field.type === 'email') {
    if (v.valueMissing) return 'contact.err.emailEmpty';
    if (v.typeMismatch) return 'contact.err.emailFormat';
    return null;
  }
  if (v.valueMissing || !field.value.trim()) return field.name === 'name' ? 'contact.err.name' : 'contact.err.msg';
  return null;
}

/* Affiche (ou efface) l'erreur sous le champ. La clé reste posée en
   data-i18n : si on change de langue, le message se traduit aussi. */
function showError(field) {
  const key = errorKey(field);
  const slot = document.getElementById(field.id + '-err');
  field.setAttribute('aria-invalid', key ? 'true' : 'false');
  if (key) {
    slot.dataset.i18n = key;
    slot.textContent = t(key);
  } else {
    delete slot.dataset.i18n;
    slot.textContent = '';
  }
  return !key;
}

function initCopy() {
  const btn = document.querySelector('.direct-copy');
  if (!btn) return;
  let timer;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.email);
    } catch {
      // Presse-papiers refusé (http, ancien navigateur) : on ouvre la messagerie
      location.href = 'mailto:' + btn.dataset.email;
      return;
    }
    btn.dataset.i18n = 'contact.copied';
    btn.textContent = t('contact.copied');
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.dataset.i18n = 'contact.copy';
      btn.textContent = t('contact.copy');
    }, 2000);
  });
}

export function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), textarea')];
  initCopy();
  // Le message d'état garde sa clé : il se traduit si on change de langue
  const setStatus = (key) => { status.dataset.i18n = key; status.textContent = t(key); };

  // Avant le premier envoi, on ne gronde pas pendant la frappe :
  // on vérifie en quittant le champ s'il a été rempli, puis en direct
  // une fois qu'une erreur est affichée.
  fields.forEach((field) => {
    field.addEventListener('blur', () => { if (field.value) showError(field); });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') showError(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation côté client : chaque champ affiche son erreur,
    // et le curseur va au premier à corriger
    const invalid = fields.filter((field) => !showError(field));
    if (invalid.length) {
      setStatus('contact.invalid');
      invalid[0].focus();
      return;
    }

    button.disabled = true;
    setStatus('contact.sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json();

      if (data.success) {
        setStatus('contact.success');
        form.reset();
        fields.forEach((field) => field.removeAttribute('aria-invalid'));
        // La récompense : le Soleil la lance s'il est là (solar.js),
        // sinon l'étoile filante d'origine traverse l'écran
        const reward = new CustomEvent('transmission', { cancelable: true });
        if (dispatchEvent(reward)) shootStar();
      } else {
        throw new Error(data.message);
      }
    } catch {
      setStatus('contact.error');
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
