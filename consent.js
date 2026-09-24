/* Preferências locais. Nenhuma tag de análise ou anúncio é carregada por este arquivo. */
(() => {
  'use strict';

  const key = 'carvalho-motos-consent-v1';
  const lifetime = 365 * 24 * 60 * 60 * 1000;
  let choice = readChoice();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  if (choice) updateGoogle(choice);

  window.CarvalhoConsent = {
    get: () => choice ? { ...choice } : { analytics: false, marketing: false, decided: false },
    set: (preferences) => saveChoice(preferences)
  };

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (!saved || typeof saved.analytics !== 'boolean' || typeof saved.marketing !== 'boolean' || !Number.isFinite(saved.expiresAt) || saved.expiresAt <= Date.now()) return null;
      return saved;
    } catch { return null; }
  }

  function updateGoogle(preferences) {
    const ads = preferences.marketing ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: ads,
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_user_data: ads,
      ad_personalization: ads
    });
  }

  function saveChoice(preferences) {
    choice = {
      analytics: preferences.analytics === true,
      marketing: preferences.marketing === true,
      decided: true,
      updatedAt: new Date().toISOString(),
      expiresAt: Date.now() + lifetime
    };
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch {}
    updateGoogle(choice);
    document.dispatchEvent(new CustomEvent('carvalho:consent', { detail: { ...choice } }));
    document.querySelector('.cookie-banner')?.setAttribute('hidden', '');
    const dialog = document.querySelector('.cookie-dialog');
    if (dialog?.open) dialog.close();
    return { ...choice };
  }

  function mount() {
    const host = document.createElement('div');
    host.innerHTML = `
      <section class="cookie-banner" role="region" aria-label="Preferências de privacidade" hidden>
        <div class="cookie-copy"><strong>Sua privacidade importa.</strong><p>Usamos armazenamento local para sua lista de motos, destaques e escolhas de privacidade. Análise e publicidade são opcionais e ficam desativadas até sua escolha. <a href="/politica-de-cookies">Entenda os cookies</a>.</p></div>
        <div class="cookie-actions"><button type="button" data-consent="reject">Rejeitar opcionais</button><button type="button" data-consent="settings">Personalizar</button><button type="button" class="cookie-accept" data-consent="accept">Aceitar todos</button></div>
      </section>
      <dialog class="cookie-dialog" aria-labelledby="cookie-dialog-title">
        <div class="cookie-dialog-head"><div><span>PRIVACIDADE</span><h2 id="cookie-dialog-title">Preferências de cookies</h2></div><button type="button" class="cookie-close" data-consent="close" aria-label="Fechar preferências">×</button></div>
        <p>Escolha as finalidades opcionais. A lista de motos e a segurança do site continuam funcionando mesmo que você recuse.</p>
        <div class="cookie-choice"><div><strong>Essenciais</strong><small>Lista de interesse, sua escolha de privacidade e segurança do site.</small></div><span>Sempre ativos</span></div>
        <label class="cookie-choice"><div><strong>Análise</strong><small>Medição de visitas e uso do site quando uma ferramenta de análise for ativada.</small></div><input type="checkbox" id="consent-analytics"></label>
        <label class="cookie-choice"><div><strong>Publicidade</strong><small>Medição de campanhas e anúncios personalizados quando uma ferramenta de anúncios for ativada.</small></div><input type="checkbox" id="consent-marketing"></label>
        <div class="cookie-dialog-actions"><a href="/politica-de-privacidade">Política de privacidade</a><button type="button" class="cookie-save" data-consent="save">Salvar preferências</button></div>
      </dialog>`;
    document.body.append(host);
    const banner = host.querySelector('.cookie-banner');
    const dialog = host.querySelector('.cookie-dialog');
    const analytics = host.querySelector('#consent-analytics');
    const marketing = host.querySelector('#consent-marketing');

    if (!choice) banner.hidden = false;

    document.addEventListener('click', event => {
      const button = event.target.closest('[data-cookie-settings]');
      if (!button) return;
      event.preventDefault();
      analytics.checked = choice?.analytics || false;
      marketing.checked = choice?.marketing || false;
      dialog.showModal();
    });

    host.addEventListener('click', event => {
      const action = event.target.closest('[data-consent]')?.dataset.consent;
      if (action === 'accept') saveChoice({ analytics: true, marketing: true });
      if (action === 'reject') saveChoice({ analytics: false, marketing: false });
      if (action === 'settings') {
        analytics.checked = choice?.analytics || false;
        marketing.checked = choice?.marketing || false;
        dialog.showModal();
      }
      if (action === 'save') saveChoice({ analytics: analytics.checked, marketing: marketing.checked });
      if (action === 'close') dialog.close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
