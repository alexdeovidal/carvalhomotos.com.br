const WHATSAPP = '5564984363636';
const PRODUCTS = [
  {
    id: 'shi-125', name: 'Shineray SHI 125', category: 'urbanas', type: 'Urbana', image: '/public/products/shi-125.png',
    badge: 'Destaque da loja', description: 'Economia, conforto e tecnologia para acompanhar a rotina. Modelo apresentado na campanha da Carvalho Motos.',
    features: ['125 cc', 'Partida elétrica', 'Freios CBS'], source: '/public/carvalho-motos-campanha.png', sourceLabel: 'Ver campanha ↗'
  },
  {
    id: 'new-jet-125', name: 'Shineray New Jet 125', category: 'urbanas', type: 'Urbana', image: '/public/products/jet-125.webp',
    badge: 'No Instagram', description: 'Um modelo prático para os trajetos da cidade, divulgado pela Carvalho Motos em setembro de 2026.',
    features: ['125 cc', 'Painel digital', 'Iluminação LED'], source: 'https://www.instagram.com/carvalhomotos/reel/Dcv9ktxRxwu/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'rio-125-efi', name: 'Shineray Rio 125 EFI', category: 'urbanas', type: 'Urbana', image: '/public/products/rio-125-efi.webp',
    badge: 'No Instagram', description: 'Mobilidade urbana com injeção eletrônica, painel digital e porta USB. Modelo apresentado no perfil da loja.',
    features: ['125 cc', 'Injeção eletrônica', 'Painel digital'], source: 'https://www.instagram.com/carvalhomotos/p/Ddo7Z6BCdgu/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'denver-400', name: 'Shineray Denver 400', category: 'custom', type: 'Custom', image: '/public/products/denver-400.webp',
    badge: 'Lançamento', description: 'Uma custom de visual clássico para viver a estrada do seu jeito. Lançamento divulgado pela Carvalho Motos.',
    features: ['400 cc', 'Motor em V', 'Transmissão por correia'], source: 'https://www.instagram.com/carvalhomotos/p/DdmlSChiSHm/', sourceLabel: 'Ver publicação ↗'
  }
];

const productById = Object.fromEntries(PRODUCTS.map(product => [product.id, product]));
const grid = document.getElementById('product-grid');
const productDialog = document.getElementById('product-dialog');
const cartDialog = document.getElementById('cart-dialog');
const checkoutDialog = document.getElementById('checkout-dialog');
const search = document.getElementById('product-search');
let filter = 'todos';
let selectedProduct = null;
let cart = readCart();

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('carvalho-motos-cart') || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => productById[id] && Number.isInteger(quantity) && quantity > 0 && quantity <= 99));
  } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem('carvalho-motos-cart', JSON.stringify(cart)); } catch {}
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  renderCart();
}
function addToCart(id) {
  cart[id] = Math.min(99, (cart[id] || 0) + 1);
  saveCart();
  if (productDialog.open) productDialog.close();
  cartDialog.showModal();
}
function cardMarkup(product) {
  return `<article class="product-card">
    <button type="button" class="product-photo" data-detail="${product.id}" aria-label="Ver detalhes de ${product.name}"><span class="product-badge">${product.badge}</span><img src="${product.image}" alt="${product.name}" loading="lazy"></button>
    <div class="product-info"><p class="product-type">SHINERAY / ${product.type}</p><h3>${product.name}</h3><p class="product-price">Valor sob consulta</p><div class="product-actions"><button type="button" class="product-detail-button" data-detail="${product.id}">Ver detalhes</button><button type="button" class="product-add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} à lista">Adicionar +</button></div></div>
  </article>`;
}
function renderProducts() {
  const term = search.value.trim().toLocaleLowerCase('pt-BR');
  const visible = PRODUCTS.filter(product => (filter === 'todos' || product.category === filter) && product.name.toLocaleLowerCase('pt-BR').includes(term));
  grid.innerHTML = visible.length ? visible.map(cardMarkup).join('') : '<p class="no-results">Nenhum modelo encontrado. Tente outra busca.</p>';
}
function renderCart() {
  const entries = Object.entries(cart);
  const container = document.getElementById('cart-items');
  if (!entries.length) {
    container.innerHTML = '<div class="empty-cart"><strong>Sua lista está vazia.</strong><p>Escolha uma moto no catálogo para começar.</p></div>';
  } else {
    container.innerHTML = entries.map(([id, quantity]) => {
      const product = productById[id];
      return `<div class="cart-item"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><span>Valor sob consulta</span><div class="quantity-controls"><button type="button" data-qty="${id}" data-change="-1" aria-label="Diminuir quantidade de ${product.name}">−</button><span>${quantity}</span><button type="button" data-qty="${id}" data-change="1" aria-label="Aumentar quantidade de ${product.name}">+</button><button type="button" class="remove-item" data-remove="${id}">Remover</button></div></div></div>`;
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
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-features').innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
  document.getElementById('detail-source').href = product.source;
  document.getElementById('detail-source').textContent = product.sourceLabel;
  productDialog.showModal();
}
function showCheckout() {
  if (!Object.keys(cart).length) return;
  cartDialog.close();
  document.getElementById('checkout-summary').innerHTML = Object.entries(cart).map(([id, quantity]) => `<div><span>${quantity} × ${productById[id].name}</span><span>Sob consulta</span></div>`).join('');
  checkoutDialog.showModal();
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', active); });
  renderProducts();
}));
search.addEventListener('input', renderProducts);
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
renderProducts();
saveCart();
