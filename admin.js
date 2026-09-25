const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const labels = { inquiry: 'Sob consulta', available: 'Disponível', out_of_stock: 'Fora de estoque', inactive: 'Oculto' };
const categories = { urbanas: 'Motos urbanas', trail: 'Trail e crossover', custom: 'Custom', eletricas: 'Scooters elétricas', bicicletas: 'Bicicletas elétricas', triciclos: 'Triciclos elétricos' };
let csrf = '';
let products = [];
let editingId = null;
let deletingId = null;
let images = [];
let noticeTimer;

function notice(message, error = false) {
  const element = $('#notice');
  element.textContent = message;
  element.classList.toggle('error', error);
  element.hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { element.hidden = true; }, 5500);
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof Blob)) headers['Content-Type'] = 'application/json';
  if (options.method && options.method !== 'GET') headers['X-CSRF-Token'] = csrf;
  const response = await fetch(path, { ...options, headers, credentials: 'same-origin', cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== '/api/admin/login') showLogin();
    throw new Error(typeof data.detail === 'string' ? data.detail : 'Não foi possível concluir a operação.');
  }
  return data;
}

function showLogin() {
  csrf = '';
  $('#loading-view').hidden = true;
  $('#dashboard-view').hidden = true;
  $('#login-view').hidden = false;
}

function showDashboard() {
  $('#loading-view').hidden = true;
  $('#login-view').hidden = true;
  $('#dashboard-view').hidden = false;
}

async function refreshProducts() {
  products = await api('/api/admin/products');
  render();
}

function render() {
  $('#stats').innerHTML = [
    ['Total no banco', products.length],
    ['Disponíveis', products.filter((p) => p.status === 'available').length],
    ['Sob consulta', products.filter((p) => p.status === 'inquiry').length],
    ['Fora de estoque / ocultos', products.filter((p) => ['out_of_stock', 'inactive'].includes(p.status)).length],
  ].map(([label, count]) => `<div class="stat"><strong>${count}</strong><span>${label}</span></div>`).join('');
  const term = $('#admin-search').value.trim().toLocaleLowerCase('pt-BR');
  const status = $('#admin-filter').value;
  const visible = products.filter((product) => (status === 'all' || product.status === status) && `${product.name} ${product.category} ${product.type}`.toLocaleLowerCase('pt-BR').includes(term));
  $('#product-list').innerHTML = visible.length ? visible.map((product) => `<article class="product-row" data-id="${escapeHtml(product.id)}"><img src="${escapeHtml(product.image)}" alt=""><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.type)} · ${product.images.length} foto(s)</p></div><span class="category">${escapeHtml(categories[product.category] || product.category)}</span><select aria-label="Situação de ${escapeHtml(product.name)}" data-status="${escapeHtml(product.id)}">${Object.entries(labels).map(([value, label]) => `<option value="${value}" ${product.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select><div class="row-actions"><button type="button" data-edit="${escapeHtml(product.id)}">Editar</button><button type="button" class="danger" data-delete="${escapeHtml(product.id)}">Excluir</button></div></article>`).join('') : '<div class="empty-list">Nenhum produto encontrado.</div>';
}

function renderImages() {
  $('#image-list').innerHTML = images.map((url, index) => `<div class="image-item"><img src="${escapeHtml(url)}" alt="Foto ${index + 1}"><button type="button" data-remove-image="${index}" aria-label="Remover foto ${index + 1}">×</button><small>${index === 0 ? 'Foto principal' : `Foto ${index + 1}`}</small></div>`).join('');
}

function openForm(product = null) {
  editingId = product?.id || null;
  $('#product-form').reset();
  $('#form-title').textContent = product ? `Editar ${product.name}` : 'Novo produto';
  const form = $('#product-form').elements;
  if (product) {
    for (const field of ['name', 'category', 'type', 'badge', 'description', 'source', 'sourceLabel', 'status', 'sort_order']) form.namedItem(field).value = product[field] ?? '';
    form.namedItem('features').value = product.features.join('\n');
  } else {
    form.namedItem('status').value = 'inquiry';
    form.namedItem('sort_order').value = String((Math.max(0, ...products.map((p) => p.sort_order)) + 10));
  }
  images = product ? [...product.images] : [];
  renderImages();
  $('#product-dialog').showModal();
}

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const result = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ email: event.target.elements.namedItem('email').value, password: event.target.elements.namedItem('password').value }) });
    csrf = result.csrf;
    event.target.elements.namedItem('password').value = '';
    await refreshProducts();
    showDashboard();
  } catch (error) { notice(error.message, true); }
  finally { button.disabled = false; }
});

$('#logout').addEventListener('click', async () => {
  try { await api('/api/admin/logout', { method: 'POST' }); }
  finally { showLogin(); }
});
$('#new-product').addEventListener('click', () => openForm());
$('#watch-tutorial').addEventListener('click', () => {
  $('#tutorial-video').src = 'https://www.youtube-nocookie.com/embed/c4qALLcS_Ko?autoplay=1&rel=0';
  $('#tutorial-dialog').showModal();
});
$('#close-tutorial').addEventListener('click', () => $('#tutorial-dialog').close());
$('#tutorial-dialog').addEventListener('close', () => $('#tutorial-video').removeAttribute('src'));
$('#tutorial-dialog').addEventListener('click', (event) => {
  if (event.target === $('#tutorial-dialog')) $('#tutorial-dialog').close();
});
$('#close-form').addEventListener('click', () => $('#product-dialog').close());
$('#cancel-form').addEventListener('click', () => $('#product-dialog').close());
$('#cancel-delete').addEventListener('click', () => $('#delete-dialog').close());
$('#delete-dialog').addEventListener('close', () => { deletingId = null; });
$('#delete-dialog').addEventListener('click', (event) => {
  if (event.target === $('#delete-dialog')) $('#delete-dialog').close();
});
$('#confirm-delete').addEventListener('click', async () => {
  if (!deletingId) return;
  const button = $('#confirm-delete');
  button.disabled = true;
  try {
    await api(`/api/admin/products/${encodeURIComponent(deletingId)}`, { method: 'DELETE' });
    $('#delete-dialog').close();
    await refreshProducts();
    notice('Produto excluído.');
  } catch (error) { notice(error.message, true); }
  finally { button.disabled = false; }
});
$('#admin-search').addEventListener('input', render);
$('#admin-filter').addEventListener('change', render);
$('#image-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-image]');
  if (!button) return;
  images.splice(Number(button.dataset.removeImage), 1);
  renderImages();
});

$('#image-upload').addEventListener('change', async (event) => {
  const files = [...event.target.files];
  event.target.value = '';
  if (images.length + files.length > 8) return notice('Cada produto aceita até 8 fotos.', true);
  for (const file of files) {
    if (file.size > 8 * 1024 * 1024) { notice(`${file.name}: acima de 8 MB.`, true); continue; }
    try {
      const uploaded = await api('/api/admin/uploads', { method: 'POST', body: file, headers: { 'Content-Type': file.type } });
      images.push(uploaded.url);
      renderImages();
    } catch (error) { notice(`${file.name}: ${error.message}`, true); }
  }
});

$('#product-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!images.length) return notice('Envie pelo menos uma foto do produto.', true);
  const fields = new FormData(event.target);
  const body = Object.fromEntries(fields.entries());
  body.features = String(body.features || '').split('\n').map((value) => value.trim()).filter(Boolean);
  body.images = images;
  body.sort_order = Number(body.sort_order) || 0;
  const submit = event.target.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await api(editingId ? `/api/admin/products/${encodeURIComponent(editingId)}` : '/api/admin/products', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(body) });
    $('#product-dialog').close();
    await refreshProducts();
    notice(editingId ? 'Produto atualizado.' : 'Produto cadastrado.');
  } catch (error) { notice(error.message, true); }
  finally { submit.disabled = false; }
});

$('#product-list').addEventListener('click', (event) => {
  const edit = event.target.closest('[data-edit]');
  const remove = event.target.closest('[data-delete]');
  if (edit) openForm(products.find((item) => item.id === edit.dataset.edit));
  if (remove) {
    const product = products.find((item) => item.id === remove.dataset.delete);
    if (!product) return;
    deletingId = product.id;
    $('#delete-product-name').textContent = product.name;
    $('#delete-dialog').showModal();
    $('#cancel-delete').focus();
  }
});
$('#product-list').addEventListener('change', async (event) => {
  const select = event.target.closest('[data-status]');
  if (!select) return;
  const product = products.find((item) => item.id === select.dataset.status);
  if (!product) return;
  try {
    await api(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: 'PUT', body: JSON.stringify({ ...product, status: select.value }) });
    await refreshProducts();
    notice(`Situação de ${product.name} atualizada.`);
  } catch (error) { select.value = product.status; notice(error.message, true); }
});

(async () => {
  try {
    const result = await api('/api/admin/session');
    csrf = result.csrf;
    await refreshProducts();
    showDashboard();
  } catch { showLogin(); }
})();
