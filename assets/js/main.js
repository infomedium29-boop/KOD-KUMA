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
const orderForm = document.querySelector('#order-form');
const orderBuilder = document.querySelector('.order-builder');
const addDishBtn = document.querySelector('#add-dish');
const totalEl = document.querySelector('#order-total');
const totalInput = document.querySelector('#narudzba-total');
const summaryInput = document.querySelector('#narudzba-summary');
const orderSubmitBtn = document.querySelector('#order-submit');
const orderStatus = document.querySelector('#order-form-status');

function getDishPrice(dishText) {
  const match = dishText.match(/-\s*(\d+(?:[,.]\d+)?)\s*€/);
  return match ? Number(match[1].replace(',', '.')) : 0;
}


function formatDishPrice(dishText) {
  const price = getDishPrice(dishText);
  return price ? `${price.toFixed(2).replace('.', ',')} €` : '';
}

function updateOrderReferencePrices() {
  if (!orderForm) return;
  orderForm.querySelectorAll('.order-row').forEach((row) => {
    const select = row.querySelector('.dish-select');
    if (!select) return;
    let pair = row.querySelector('.order-price-pair');
    if (!pair) {
      pair = document.createElement('div');
      pair.className = 'order-price-pair';
      select.insertAdjacentElement('afterend', pair);
    }
    const priceText = formatDishPrice(select.value || '');
    if (!priceText) {
      pair.classList.remove('is-visible');
      pair.innerHTML = '';
      return;
    }
    pair.innerHTML = `<span>Aktualna cijena <b>${priceText}</b></span><span>10.09.2026. <b>${priceText}</b></span>`;
    pair.classList.add('is-visible');
  });
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
  const totalReferenceEl = document.querySelector('#order-total-reference');
  if (totalReferenceEl) totalReferenceEl.textContent = `10.09.2026.: ${totalText}`;
  updateOrderReferencePrices();
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
  const pair = newRow.querySelector('.order-price-pair');
  if (pair) { pair.innerHTML = ''; pair.classList.remove('is-visible'); }

  return newRow;
}

function showOrderStatus(message, type = '') {
  if (!orderStatus) return;
  orderStatus.textContent = message;
  orderStatus.className = `order-form-status${type ? ` ${type}` : ''}`;
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
  orderForm.addEventListener('input', () => {
    calculateOrder();
    if (orderStatus?.textContent) showOrderStatus('');
  });
  orderForm.addEventListener('change', () => {
    calculateOrder();
    if (orderStatus?.textContent) showOrderStatus('');
  });
  calculateOrder();

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const result = calculateOrder();
    if (!result.items.length) {
      showOrderStatus('Molimo odaberite barem jedno jelo i količinu.', 'error');
      return;
    }

    const pickupMethod = orderForm.querySelector('[name="nacin_preuzimanja"]')?.value;
    const addressInput = orderForm.querySelector('[name="adresa"]');
    if (pickupMethod === 'Dostava' && !addressInput?.value.trim()) {
      showOrderStatus('Za dostavu je potrebno upisati adresu.', 'error');
      addressInput?.focus();
      return;
    }

    if (orderSubmitBtn) {
      orderSubmitBtn.disabled = true;
      orderSubmitBtn.textContent = 'Šaljem narudžbu...';
    }
    showOrderStatus('');

    try {
      const formData = new FormData(orderForm);
      const response = await fetch(orderForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Narudžbu trenutno nije moguće poslati.');
      }

      showOrderStatus('Narudžba je uspješno poslana. Hvala! Kontaktirat ćemo vas ako bude potrebno.', 'success');
      orderForm.reset();
      calculateOrder();
    } catch (error) {
      console.error('Web3Forms order error:', error);
      showOrderStatus('Narudžba nije poslana. Pokušajte ponovno ili nas kontaktirajte telefonom.', 'error');
    } finally {
      if (orderSubmitBtn) {
        orderSubmitBtn.disabled = false;
        orderSubmitBtn.textContent = 'Pošalji narudžbu';
      }
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

// Brendirani modal: obavijest o neradnim danima
(function () {
  const sessionKey = 'kodKumaClosureNoticeSep2026SeenV1';
  const noticeExpiresAt = new Date('2026-09-28T00:00:00+02:00').getTime();

  function hasSeenNotice() {
    try {
      return sessionStorage.getItem(sessionKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  function markNoticeAsSeen() {
    try {
      sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      // Stranica i dalje radi ako preglednik blokira pohranu sesije.
    }
  }

  function createOpeningModal() {
    if (Date.now() >= noticeExpiresAt || hasSeenNotice()) return;

    const modal = document.createElement('div');
    modal.className = 'opening-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'opening-modal-title');
    modal.innerHTML = `
      <div class="opening-modal-backdrop" data-opening-close></div>
      <div class="opening-modal-card">
        <div class="opening-modal-image"></div>
        <div class="opening-modal-shade"></div>
        <button class="opening-modal-close" type="button" aria-label="Zatvori obavijest" data-opening-close>×</button>
        <div class="opening-modal-content">
          <div class="opening-modal-logo">Kod Kuma<span>.</span></div>
          <p class="opening-modal-kicker">Važna obavijest</p>
          <h2 id="opening-modal-title">Ne radimo 25., 26. i 27. rujna</h2>
          <p class="opening-modal-text">Restoran Kod Kuma neće raditi u petak 25.09., subotu 26.09. i nedjelju 27.09. Hvala vam na razumijevanju.</p>
          <button class="btn primary opening-modal-btn" type="button" data-opening-close>U redu, hvala</button>
          <span class="opening-modal-note">Kod Kuma · obavijest o radnom vremenu</span>
        </div>
      </div>`;

    document.body.appendChild(modal);
    document.body.classList.add('opening-modal-active');

    const closeModal = () => {
      markNoticeAsSeen();
      modal.classList.remove('is-visible');
      document.body.classList.remove('opening-modal-active');
      window.setTimeout(() => modal.remove(), 500);
    };

    modal.querySelectorAll('[data-opening-close]').forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function handleEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => modal.classList.add('is-visible'));
    });

    modal.querySelector('.opening-modal-btn')?.focus({ preventScroll: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createOpeningModal);
  } else {
    createOpeningModal();
  }
})();
