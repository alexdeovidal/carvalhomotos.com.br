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
    badge: 'No Instagram', description: 'Mobilidade urbana com injeção eletrônica, painel digital e porta USB. Uma foto da loja também identifica a Rio 125 CDI; confirme qual versão está disponível.',
    features: ['125 cc', 'Injeção eletrônica', 'Painel digital'], source: 'https://www.instagram.com/carvalhomotos/p/Ddo7Z6BCdgu/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'denver-400', name: 'Shineray Denver 400', category: 'custom', type: 'Custom', image: '/public/products/denver-400.webp',
    badge: 'Lançamento', description: 'Uma custom de visual clássico para viver a estrada do seu jeito. Lançamento divulgado pela Carvalho Motos.',
    features: ['400 cc', 'Motor em V', 'Transmissão por correia'], source: 'https://www.instagram.com/carvalhomotos/p/DdmlSChiSHm/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'ultra-capri', name: 'Ultra Moove Capri', category: 'eletricas', type: 'Scooter elétrica', image: '/public/products/ultra-capri.png',
    badge: 'Elétrica', description: 'Scooter elétrica da linha Ultra Moove mostrada nas publicações da Carvalho Motos. Consulte cores, preço e disponibilidade.',
    features: ['Motor 1000 W', 'Bateria de lítio', 'Mobilidade elétrica'], source: 'https://www.instagram.com/carvalhomotos/reel/Dcyk3twx-fU/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'ultra-max', name: 'Ultra Moove Ultra Max', category: 'eletricas', type: 'Scooter elétrica', image: '/public/products/ultra-max.png',
    badge: 'Elétrica', description: 'Scooter elétrica Ultra Max apresentada no perfil da loja. Fale com a equipe para confirmar configuração, cores e condições.',
    features: ['Motor 1000 W', 'Painel digital', 'Bateria de lítio'], source: 'https://www.instagram.com/carvalhomotos/p/DcTdtnSxujk/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'ultra-bike', name: 'Bicicleta elétrica Ultra Moove', category: 'bicicletas', type: 'Bicicleta elétrica', image: '/public/products/ultra-santorini-r8.png',
    badge: 'Elétrica', description: 'A Carvalho Motos apresentou uma bicicleta elétrica Ultra Moove de 7 marchas. A imagem mostra um modelo da linha Santorini como referência; confirme com a equipe o modelo disponível.',
    features: ['Versão anunciada com 7 marchas', 'Assistência elétrica', 'Modelo exato sob consulta'], source: 'https://www.instagram.com/carvalhomotos/p/Dcgjp21RBRD/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'shi-175-efi', name: 'Shineray SHI 175 EFI', category: 'trail', type: 'Trail', image: '/public/products/shi-175-efi.webp',
    badge: 'No Instagram', description: 'Trail de 175 cilindradas divulgada pela Carvalho Motos. Uma publicação anterior também cita a SHI 175 CDI; confirme qual versão e cores estão disponíveis.',
    features: ['175 cc', 'Injeção eletrônica', 'Uso urbano e estrada de terra'], source: 'https://www.instagram.com/carvalhomotos/p/DaVtN3qpJWa/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'shi-175s-efi', name: 'Shineray SHI 175S EFI', category: 'trail', type: 'Trail', image: '/public/products/shi-175s-efi.webp',
    badge: 'No Instagram', description: 'Versão SHI 175S EFI apresentada no perfil da loja para trajetos urbanos e rurais.',
    features: ['175 cc', 'Injeção eletrônica', 'Perfil trail'], source: 'https://www.instagram.com/carvalhomotos/p/DY7G3NzEbQo/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'shi-250', name: 'Shineray SHI 250', category: 'trail', type: 'Trail', image: '/public/products/shi-250.webp',
    badge: 'Aventureira', description: 'Trail de 250 cilindradas anunciada pela Carvalho Motos. Simule sua compra com a equipe.',
    features: ['250 cc', 'Painel digital', 'Rodas raiadas'], source: 'https://www.instagram.com/carvalhomotos/p/DavFY_lR26e/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'jef-150s', name: 'Shineray JEF 150S', category: 'urbanas', type: 'Urbana', image: '/public/products/jef-150s.webp',
    badge: 'No Instagram', description: 'Street 150S divulgada em diferentes cores pela loja. Consulte a versão e os equipamentos disponíveis.',
    features: ['150 cc', 'Painel digital', 'Câmbio de 5 marchas'], source: 'https://www.instagram.com/carvalhomotos/p/DUS7t3MjfEy/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'storm-200', name: 'Shineray Storm 200 EFI', category: 'trail', type: 'Crossover', image: '/public/products/storm-200.webp',
    badge: 'No Instagram', description: 'Crossover Storm 200 anunciada pela Carvalho Motos, com proposta para cidade e passeios.',
    features: ['200 cc', 'Injeção eletrônica', 'Iluminação LED'], source: 'https://www.instagram.com/carvalhomotos/p/DWUfxJ7iV6q/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'sbm-250t', name: 'SBM 250T', category: 'trail', type: 'Trail', image: '/public/products/sbm-250t.webp',
    badge: 'No Instagram', description: 'Modelo de 250 cilindradas anunciado para quem busca versatilidade na cidade e em percursos mais exigentes.',
    features: ['250 cc', 'Câmbio de 6 marchas', 'Freios ABS'], source: 'https://www.instagram.com/carvalhomotos/reel/DZNqyfCtFSa/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'jet-125ss', name: 'Shineray Jet 125 SS', category: 'urbanas', type: 'Urbana', image: '/public/products/jet-125ss.webp',
    badge: 'No Instagram', description: 'Jet 125 SS anunciada no perfil da Carvalho Motos. Consulte a versão e as condições atuais.',
    features: ['125 cc', 'Câmbio de 4 marchas', 'Painel digital'], source: 'https://www.instagram.com/carvalhomotos/p/DN84Qz-CQnK/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'titanium-250', name: 'Shineray Titanium 250', category: 'custom', type: 'Custom', image: '/public/products/titanium-250.webp',
    badge: 'Custom', description: 'Custom bicilíndrica anunciada pela loja para quem prefere visual clássico e estrada.',
    features: ['250 cc', 'Motor em V', 'Painel digital'], source: 'https://www.instagram.com/carvalhomotos/p/DJB9A5-p7VV/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'urban-150', name: 'Shineray Urban 150', category: 'urbanas', type: 'Scooter', image: '/public/products/urban-150.webp',
    badge: 'Scooter', description: 'Scooter Urban 150 divulgada pela Carvalho Motos com foco em conforto e praticidade.',
    features: ['150 cc', 'Condução urbana', 'Consulte a versão'], source: 'https://www.instagram.com/carvalhomotos/p/DPwfsJUCQRV/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'jet-125-classic', name: 'Shineray Jet 125', category: 'urbanas', type: 'Urbana', image: '/public/products/jet-125-classic.webp',
    badge: 'No Instagram', description: 'Jet 125 anunciada no perfil da loja. Consulte a versão e a disponibilidade atual.',
    features: ['125 cc', 'Uso urbano', 'Versão sob consulta'], source: 'https://www.instagram.com/carvalhomotos/reel/DP34P3Pjdh2/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'az1', name: 'Avelloz AZ1', category: 'urbanas', type: 'Ciclomotor', image: '/public/products/az1.webp',
    badge: 'No Instagram', description: 'Ciclomotor AZ1 divulgado pela Carvalho Motos. Confirme ano, versão e condições com a equipe.',
    features: ['Modelo AZ1', 'Partida elétrica', 'Painel digital'], source: 'https://www.instagram.com/carvalhomotos/p/DKhQkGSMVAb/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'az160-xtreme', name: 'Avelloz AZ 160 Xtreme', category: 'trail', type: 'Trail', image: '/public/products/az160-xtreme.webp',
    badge: 'No Instagram', description: 'Trail AZ 160 Xtreme anunciada no perfil da Carvalho Motos. Peça uma simulação pelo WhatsApp.',
    features: ['160 cc', 'Câmbio de 5 marchas', 'Partida elétrica'], source: 'https://www.instagram.com/carvalhomotos/p/DN6SE-ziQyp/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'ultra-r4', name: 'Ultra Moove Santorini R4', category: 'bicicletas', type: 'Bicicleta elétrica', image: '/public/products/ultra-r4.webp',
    badge: 'Elétrica', description: 'Modelo R4 mostrado nas fotos públicas da Carvalho Motos. Confirme a configuração disponível antes de comprar.',
    features: ['Linha Santorini R4', 'Assistência elétrica', 'Modelo sob consulta'], source: 'https://www.facebook.com/photo.php?fbid=3613705825433824', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'rema-2025', name: 'Triciclo elétrico Rema', category: 'triciclos', type: 'Triciclo elétrico', image: '/public/products/rema-2025.webp',
    badge: 'Triciclo', description: 'Triciclo elétrico Rema anunciado pela loja. Consulte versão, cores e disponibilidade atual.',
    features: ['Mobilidade elétrica', 'Três rodas', 'Versão sob consulta'], source: 'https://www.instagram.com/carvalhomotos/p/DKAsmgypUbP/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'fox-800w', name: 'Triciclo elétrico Fox 800W', category: 'triciclos', type: 'Triciclo elétrico', image: '/public/products/fox-800w.webp',
    badge: 'Triciclo', description: 'Modelo Fox vermelho de 800 W divulgado pela Carvalho Motos. Confirme a configuração e o estoque.',
    features: ['Motor 800 W', 'Marcha ré', 'Farol e alarme'], source: 'https://www.instagram.com/carvalhomotos/p/DI_t9_KJB5E/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'scooter-500w', name: 'Scooter elétrica 500W', category: 'eletricas', type: 'Scooter elétrica', image: '/public/products/scooter-500w.webp',
    badge: 'Elétrica', description: 'Scooter de 500 W divulgada pela loja. Imagem ilustrativa da categoria; peça a foto e o modelo exato disponível.',
    features: ['Motor 500 W', 'Para trajetos curtos', 'Modelo exato sob consulta'], source: 'https://www.instagram.com/carvalhomotos/p/DXW4SNbDT3p/', sourceLabel: 'Ver publicação ↗'
  },
  {
    id: 'scooter-1000w', name: 'Scooter elétrica 1000W', category: 'eletricas', type: 'Scooter elétrica', image: '/public/products/scooter-1000w.webp',
    badge: 'Elétrica', description: 'Scooter de 1000 W anunciada pela loja. Imagem ilustrativa da categoria; confirme o modelo exato, bateria e estoque.',
    features: ['Motor 1000 W', 'Mobilidade elétrica', 'Modelo exato sob consulta'], source: 'https://www.facebook.com/photo.php?fbid=3618077904996616', sourceLabel: 'Ver publicação ↗'
  }
];

const productById = Object.fromEntries(PRODUCTS.map(product => [product.id, product]));
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
  const buyUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, Carvalho Motos! Quero comprar o modelo ${product.name}. Podem me informar preço, cores, disponibilidade e condições?`)}`;
  return `<article class="product-card">
    <button type="button" class="product-photo" data-detail="${product.id}" aria-label="Ver detalhes de ${product.name}"><span class="product-badge">${product.badge}</span><img src="${product.image}" alt="${product.name}" loading="lazy"></button>
    <div class="product-info"><p class="product-type">${product.type}</p><h3>${product.name}</h3><p class="product-price">Preço sob consulta • Chame e simule</p><div class="product-actions"><a class="product-buy-button" href="${buyUrl}" target="_blank" rel="noopener noreferrer" aria-label="Comprar ${product.name} pelo WhatsApp">Comprar pelo WhatsApp ↗</a><button type="button" class="product-add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} à lista">+ Lista</button></div><button type="button" class="product-detail-button" data-detail="${product.id}">Ver detalhes e ficha ↗</button></div>
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
    document.getElementById('pagination').innerHTML = pages > 1 ? `<button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Página anterior">←</button>${Array.from({ length: pages }, (_, i) => `<button type="button" data-page="${i + 1}" class="${page === i + 1 ? 'active' : ''}" aria-label="Página ${i + 1}" ${page === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}<button type="button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="Próxima página">→</button>` : '';
    const url = new URL(location.href);
    filter === 'todos' ? url.searchParams.delete('categoria') : url.searchParams.set('categoria', filter);
    term ? url.searchParams.set('busca', search.value.trim()) : url.searchParams.delete('busca');
    page === 1 ? url.searchParams.delete('pagina') : url.searchParams.set('pagina', String(page));
    history.replaceState(null, '', url);
  } else {
    grid.innerHTML = visible.map(cardMarkup).join('');
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
  document.getElementById('detail-buy').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, Carvalho Motos! Quero comprar o modelo ${product.name}. Podem me informar preço, cores, disponibilidade e condições?`)}`;
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
  const move = direction => {
    const card = viewport.querySelector('.product-card');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 15;
    const end = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({ left: direction > 0 && viewport.scrollLeft >= end - 5 ? 0 : Math.max(0, viewport.scrollLeft + direction * step), behavior: 'smooth' });
  };
  document.getElementById('carousel-prev').addEventListener('click', () => move(-1));
  document.getElementById('carousel-next').addEventListener('click', () => move(1));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let paused = false;
    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });
    viewport.addEventListener('focusin', () => { paused = true; });
    viewport.addEventListener('focusout', () => { paused = false; });
    setInterval(() => { if (!paused && !document.hidden) move(1); }, 4500);
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
renderProducts();
saveCart();
