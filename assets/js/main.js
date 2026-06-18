const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuBtn && nav) menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.hero-bg', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 84%' } });
  });

  const pano = gsap.timeline({
    scrollTrigger: {
      trigger: '.panorama-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  pano.to('.panorama-img', { backgroundPosition: '100% center', ease: 'none' }, 0)
      .to('.panorama-progress span', { width: '100%', ease: 'none' }, 0)
      .to('.copy-1', { opacity: 1, y: '-50%', duration: 0.08 }, 0.02)
      .to('.copy-1', { opacity: 0, y: '-58%', duration: 0.08 }, 0.20)
      .to('.copy-2', { opacity: 1, y: '-50%', duration: 0.08 }, 0.26)
      .to('.copy-2', { opacity: 0, y: '-58%', duration: 0.08 }, 0.44)
      .to('.copy-3', { opacity: 1, y: '-50%', duration: 0.08 }, 0.50)
      .to('.copy-3', { opacity: 0, y: '-58%', duration: 0.08 }, 0.68)
      .to('.copy-4', { opacity: 1, y: '-50%', duration: 0.10 }, 0.74);
} else {
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  const firstCopy = document.querySelector('.copy-1');
  if (firstCopy) firstCopy.style.opacity = '1';
}

// Online narudžba: dodavanje jela, izračun ukupne cijene i slanje u Web3Forms
const orderForm = document.querySelector('form.form');
const orderBuilder = document.querySelector('.order-builder');
const addDishBtn = document.querySelector('#add-dish');
const totalEl = document.querySelector('#order-total');
const totalInput = document.querySelector('#narudzba-total');
const summaryInput = document.querySelector('#narudzba-summary');

function getDishPrice(dishText) {
  const match = dishText.match(/-\s*(\d+(?:[,.]\d+)?)\s*€/);
  return match ? Number(match[1].replace(',', '.')) : 0;
}

function renumberOrderRows() {
  document.querySelectorAll('.order-row').forEach((row, index) => {
    const number = index + 1;
    const select = row.querySelector('.dish-select');
    const qty = row.querySelector('.dish-qty');
    if (select) select.name = `jelo_${number}`;
    if (qty) qty.name = `kolicina_${number}`;
  });
}

function calculateOrder() {
  if (!orderForm) return { items: [], total: 0 };

  const rows = [...orderForm.querySelectorAll('.order-row')];
  let total = 0;
  const items = [];

  rows.forEach((row) => {
    const dish = row.querySelector('.dish-select')?.value || '';
    const qty = Number(row.querySelector('.dish-qty')?.value || 0);
    const price = getDishPrice(dish);

    if (dish && qty > 0) {
      const lineTotal = price * qty;
      total += lineTotal;
      items.push(`${qty}x ${dish} = ${lineTotal.toFixed(2).replace('.', ',')} €`);
    }
  });

  const totalText = `${total.toFixed(2).replace('.', ',')} €`;
  if (totalEl) totalEl.textContent = totalText;
  if (totalInput) totalInput.value = totalText;
  if (summaryInput) summaryInput.value = items.join('\n');

  return { items, total };
}

function createOrderRow() {
  const firstRow = document.querySelector('.order-row');
  if (!firstRow) return null;

  const newRow = firstRow.cloneNode(true);
  const select = newRow.querySelector('.dish-select');
  const qty = newRow.querySelector('.dish-qty');

  if (select) select.value = '';
  if (qty) qty.value = '0';

  return newRow;
}

if (addDishBtn && orderBuilder) {
  addDishBtn.addEventListener('click', () => {
    const newRow = createOrderRow();
    if (!newRow) return;

    orderBuilder.insertBefore(newRow, addDishBtn);
    renumberOrderRows();
    calculateOrder();
  });
}

if (orderForm) {
  orderForm.addEventListener('input', calculateOrder);
  orderForm.addEventListener('change', calculateOrder);
  calculateOrder();

  orderForm.addEventListener('submit', (event) => {
    const result = calculateOrder();
    if (!result.items.length) {
      event.preventDefault();
      alert('Molimo odaberite barem jedno jelo i količinu.');
    }
  });
}


// GDPR / Cookie consent
(function () {
  const consentKey = 'kodKumaCookieConsent';
  const consent = localStorage.getItem(consentKey);

  function loadMarketingScripts() {
    document.querySelectorAll('script[type="text/plain"][data-cookie-category="marketing"]').forEach((oldScript) => {
      const newScript = document.createElement('script');
      [...oldScript.attributes].forEach(attr => {
        if (attr.name !== 'type' && attr.name !== 'data-cookie-category') newScript.setAttribute(attr.name, attr.value);
      });
      newScript.text = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function saveConsent(value) {
    localStorage.setItem(consentKey, JSON.stringify({
      necessary: true,
      analytics: !!value.analytics,
      marketing: !!value.marketing,
      savedAt: new Date().toISOString()
    }));
    if (value.marketing || value.analytics) loadMarketingScripts();
    const banner = document.querySelector('.cookie-banner');
    if (banner) banner.classList.remove('show');
  }

  function initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    const settingsPanel = banner.querySelector('.cookie-panel');
    const analyticsInput = banner.querySelector('#cookie-analytics');
    const marketingInput = banner.querySelector('#cookie-marketing');

    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true });
    });

    banner.querySelector('[data-cookie-reject]')?.addEventListener('click', () => {
      saveConsent({ analytics: false, marketing: false });
    });

    banner.querySelector('[data-cookie-settings]')?.addEventListener('click', () => {
      settingsPanel?.classList.toggle('show');
    });

    banner.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
      saveConsent({
        analytics: analyticsInput?.checked,
        marketing: marketingInput?.checked
      });
    });

    if (!consent) {
      banner.classList.add('show');
    } else {
      try {
        const saved = JSON.parse(consent);
        if (saved.analytics || saved.marketing) loadMarketingScripts();
      } catch (e) {
        localStorage.removeItem(consentKey);
        banner.classList.add('show');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
