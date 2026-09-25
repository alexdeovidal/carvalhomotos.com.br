const ARROW_NE = '<svg class="arrow-icon arrow-icon-ne" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19 19 5M8 5h11v11"/></svg>';
const ARROW_LEFT = '<svg class="arrow-icon arrow-icon-left" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
const ARROW_RIGHT = '<svg class="arrow-icon arrow-icon-right" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';

const WHATSAPP = '5564984363636';
let PRODUCTS = [];
let productById = {};
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const isPurchasable = product => product && product.status !== 'out_of_stock';
const availability = product => product.status === 'available' ? 'Disponível • Consulte o preço' : product.status === 'out_of_stock' ? 'Fora de estoque' : 'Disponibilidade sob consulta';

const grid = document.getElementById('product-grid');
const isStore = document.body.dataset.page === 'store';
const productDialog = document.getElementById('product-dialog');
const cartDialog = document.getElementById('cart-dialog');
const checkoutDialog = document.getElementById('checkout-dialog');
const search = document.getElementById('product-search');
const sort = document.getElementById('product-sort');
const params = new URLSearchParams(location.search);
let filter = isStore && ['urbanas', 'trail', 'custom', 'eletricas', 'bicicletas', 'triciclos'].includes(params.get('categoria')) ? params.get('categoria') : 'todos';
let page = isStore ? Math.max(1, Number.parseInt(params.get('pagina') || '1', 10) || 1) : 1;
const pageSize = 6;
let selectedProduct = null;
let cart = {};

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('carvalho-motos-cart') || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => isPurchasable(productById[id]) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99));
  } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem('carvalho-motos-cart', JSON.stringify(cart)); } catch {}
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  renderCart();
}
function addToCart(id) {
  if (!isPurchasable(productById[id])) return;
  cart[id] = Math.min(99, (cart[id] || 0) + 1);
  saveCart();
  if (productDialog.open) productDialog.close();
  cartDialog.showModal();
}
function cardMarkup(product) {
  const name = escapeHtml(product.name);
  const id = escapeHtml(product.id);
  const soldOut = !isPurchasable(product);
  const buyUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, Carvalho Motos! Quero comprar o modelo ${product.name}. Podem me informar preço, cores, disponibilidade e condições?`)}`;
  return `<article class="product-card">
    <button type="button" class="product-photo" data-detail="${id}" aria-label="Ver detalhes de ${name}"><span class="product-badge">${escapeHtml(product.badge || availability(product))}</span><img src="${escapeHtml(product.image)}" alt="${name}" loading="lazy"></button>
    <div class="product-info"><p class="product-type">${escapeHtml(product.type)}</p><h3>${name}</h3><p class="product-price">${availability(product)}</p><div class="product-actions">${soldOut ? '<span class="product-unavailable">Fora de estoque</span>' : `<a class="product-buy-button" href="${escapeHtml(buyUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Comprar ${name} pelo WhatsApp">Comprar pelo WhatsApp ${ARROW_NE}</a><button type="button" class="product-add-button" data-add="${id}" aria-label="Adicionar ${name} à lista">+ Lista</button>`}</div><button type="button" class="product-detail-button" data-detail="${id}">Ver detalhes e ficha ${ARROW_NE}</button></div>
  </article>`;
}
function renderProducts() {
  const term = (search?.value || '').trim().toLocaleLowerCase('pt-BR');
  const visible = PRODUCTS.filter(product => (filter === 'todos' || product.category === filter) && `${product.name} ${product.type} ${product.description}`.toLocaleLowerCase('pt-BR').includes(term));
  if (isStore) {
    if (sort.value === 'name') visible.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (sort.value === 'category') visible.sort((a, b) => a.category.localeCompare(b.category, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'));
    const pages = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, pages);
    const first = (page - 1) * pageSize;
    grid.innerHTML = visible.length ? visible.slice(first, first + pageSize).map(cardMarkup).join('') : '<p class="no-results">Nenhum modelo encontrado. Tente outra busca ou escolha outra categoria.</p>';
    document.getElementById('results-count').textContent = `${visible.length} ${visible.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}`;
    document.getElementById('pagination').innerHTML = pages > 1 ? `<button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Página anterior">${ARROW_LEFT}</button>${Array.from({ length: pages }, (_, i) => `<button type="button" data-page="${i + 1}" class="${page === i + 1 ? 'active' : ''}" aria-label="Página ${i + 1}" ${page === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}<button type="button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="Próxima página">${ARROW_RIGHT}</button>` : '';
    const url = new URL(location.href);
    filter === 'todos' ? url.searchParams.delete('categoria') : url.searchParams.set('categoria', filter);
    term ? url.searchParams.set('busca', search.value.trim()) : url.searchParams.delete('busca');
    page === 1 ? url.searchParams.delete('pagina') : url.searchParams.set('pagina', String(page));
    history.replaceState(null, '', url);
  } else {
    grid.innerHTML = visible.length ? visible.map(cardMarkup).join('') : '<p class="no-results">Nenhum modelo disponível no momento.</p>';
  }
}
function renderCart() {
  const entries = Object.entries(cart);
  const container = document.getElementById('cart-items');
  if (!entries.length) {
    container.innerHTML = '<div class="empty-cart"><strong>Sua lista está vazia.</strong><p>Escolha uma moto no catálogo para começar.</p></div>';
  } else {
    container.innerHTML = entries.map(([id, quantity]) => {
      const product = productById[id];
      return `<div class="cart-item"><img src="${escapeHtml(product.image)}" alt=""><div><strong>${escapeHtml(product.name)}</strong><span>Valor sob consulta</span><div class="quantity-controls"><button type="button" data-qty="${escapeHtml(id)}" data-change="-1" aria-label="Diminuir quantidade de ${escapeHtml(product.name)}">−</button><span>${quantity}</span><button type="button" data-qty="${escapeHtml(id)}" data-change="1" aria-label="Aumentar quantidade de ${escapeHtml(product.name)}">+</button><button type="button" class="remove-item" data-remove="${escapeHtml(id)}">Remover</button></div></div></div>`;
    }).join('');
  }
  document.getElementById('cart-checkout').disabled = entries.length === 0;
}
function showDetail(id) {
  const product = productById[id];
  if (!product) return;
  selectedProduct = id;
  document.getElementById('detail-title').textContent = product.name;
  document.getElementById('detail-image').src = product.image;
  document.getElementById('detail-image').alt = product.name;
  let gallery = document.getElementById('detail-gallery');
  if (!gallery) {
    gallery = document.createElement('div');
    gallery.id = 'detail-gallery';
    gallery.className = 'detail-gallery';
    document.querySelector('#product-dialog .detail-image').append(gallery);
  }
  gallery.replaceChildren(...product.images.map((url, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver foto ${index + 1} de ${product.name}`);
    const image = document.createElement('img');
    image.src = url;
    image.alt = '';
    button.append(image);
    button.addEventListener('click', () => { document.getElementById('detail-image').src = url; });
    return button;
  }));
  gallery.hidden = product.images.length < 2;
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-features').innerHTML = product.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('');
  document.getElementById('detail-source').href = product.source || '#';
  document.getElementById('detail-source').hidden = !product.source;
  document.getElementById('detail-source').textContent = product.sourceLabel;
  document.getElementById('detail-source').insertAdjacentHTML('beforeend', ` ${ARROW_NE}`);
  document.getElementById('detail-buy').hidden = !isPurchasable(product);
  document.getElementById('detail-add').hidden = !isPurchasable(product);
  document.querySelector('#product-dialog .consult-label').textContent = availability(product);
  document.getElementById('detail-buy').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, Carvalho Motos! Quero comprar o modelo ${product.name}. Podem me informar preço, cores, disponibilidade e condições?`)}`;
  productDialog.showModal();
}
function showCheckout() {
  if (!Object.keys(cart).length) return;
  cartDialog.close();
  document.getElementById('checkout-summary').innerHTML = Object.entries(cart).map(([id, quantity]) => `<div><span>${quantity} × ${escapeHtml(productById[id].name)}</span><span>Sob consulta</span></div>`).join('');
  checkoutDialog.showModal();
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  page = 1;
  document.querySelectorAll('.filter').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', active); });
  renderProducts();
}));
if (search) {
  search.value = params.get('busca') || '';
  search.addEventListener('input', () => { page = 1; renderProducts(); });
}
if (sort) sort.addEventListener('change', () => { page = 1; renderProducts(); });
if (isStore) {
  document.querySelectorAll('.filter').forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', active); });
  document.getElementById('pagination').addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    renderProducts();
    document.querySelector('.store-toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
} else {
  const viewport = document.getElementById('carousel-viewport');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const move = direction => {
    const card = viewport.querySelector('.product-card');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 15;
    const end = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({ left: direction > 0 && viewport.scrollLeft >= end - 5 ? 0 : Math.max(0, viewport.scrollLeft + direction * step), behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  document.getElementById('carousel-prev').addEventListener('click', () => move(-1));
  document.getElementById('carousel-next').addEventListener('click', () => move(1));
  let paused = false;
  viewport.addEventListener('mouseenter', () => { paused = true; });
  viewport.addEventListener('mouseleave', () => { paused = false; });
  viewport.addEventListener('focusin', () => { paused = true; });
  viewport.addEventListener('focusout', () => { paused = false; });
  setInterval(() => { if (!paused && !document.hidden) move(1); }, 5000);

}

function initializeHero() {
  const heroImage = document.getElementById('hero-product-image');
  const heroName = document.getElementById('hero-product-name');
  const heroLink = document.getElementById('hero-product-link');
  if (heroImage && heroName && heroLink) {
    const featuredIds = ['shi-125', 'new-jet-125', 'rio-125-efi', 'denver-400', 'ultra-capri', 'ultra-max', 'shi-250', 'storm-200', 'jet-125ss', 'titanium-250', 'urban-150', 'az160-xtreme'];
    const featured = featuredIds.map(id => productById[id]).filter(isPurchasable);
    if (!featured.length) return;
    const lastKey = 'carvalho-hero-last';
    let lastId = '';
    try { lastId = localStorage.getItem(lastKey) || ''; } catch {}
    const lastIndex = featured.findIndex(product => product.id === lastId);
    let currentIndex = Math.floor(Math.random() * (featured.length - (lastIndex >= 0 && featured.length > 1 ? 1 : 0)));
    if (lastIndex >= 0 && featured.length > 1 && currentIndex >= lastIndex) currentIndex += 1;

    const showHero = () => {
      const product = featured[currentIndex];
      heroName.textContent = product.name;
      heroImage.src = product.image;
      heroImage.alt = product.name + ' em destaque';
      heroLink.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero comprar a ${product.name}. Podem me passar preço, cores e condições?`)}`;
      try { localStorage.setItem(lastKey, product.id); } catch {}
    };
    showHero();
    setInterval(() => {
      if (document.hidden) return;
      currentIndex = (currentIndex + 1) % featured.length;
      showHero();
    }, 5000);
  }
}
grid.addEventListener('click', event => {
  const detail = event.target.closest('[data-detail]');
  const add = event.target.closest('[data-add]');
  if (detail) showDetail(detail.dataset.detail);
  if (add) addToCart(add.dataset.add);
});
document.getElementById('detail-add').addEventListener('click', () => selectedProduct && addToCart(selectedProduct));
document.getElementById('open-cart').addEventListener('click', () => cartDialog.showModal());
document.getElementById('cart-checkout').addEventListener('click', showCheckout);
document.getElementById('cart-items').addEventListener('click', event => {
  const qty = event.target.closest('[data-qty]');
  const remove = event.target.closest('[data-remove]');
  if (qty) { const id = qty.dataset.qty; cart[id] += Number(qty.dataset.change); if (cart[id] <= 0) delete cart[id]; saveCart(); }
  if (remove) { delete cart[remove.dataset.remove]; saveCart(); }
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
[productDialog, cartDialog, checkoutDialog].forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
document.getElementById('checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.target.reportValidity() || !Object.keys(cart).length) return;
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const note = document.getElementById('customer-note').value.trim();
  if (!name || !phone) return;
  const lines = Object.entries(cart).map(([id, quantity]) => `• ${quantity} × ${productById[id].name}`);
  const message = `Olá, Carvalho Motos! Vim pelo site e gostaria de consultar estes modelos:\n\n${lines.join('\n')}\n\nNome: ${name}\nMeu WhatsApp: ${phone}${note ? `\nObservação: ${note}` : ''}\n\nPodem confirmar valores, cores e disponibilidade?`;
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
});
async function loadCatalog() {
  try {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo.');
    PRODUCTS = await response.json();
    productById = Object.fromEntries(PRODUCTS.map(product => [product.id, product]));
    const campaign = document.querySelector('.campaign');
    if (campaign) campaign.hidden = !isPurchasable(productById['shi-125']);
    cart = readCart();
    renderProducts();
    saveCart();
    if (!isStore) initializeHero();
  } catch {
    grid.innerHTML = '<p class="no-results">O catálogo está temporariamente indisponível. Tente atualizar a página ou fale com a equipe pelo WhatsApp.</p>';
    saveCart();
  }
}
loadCatalog();
