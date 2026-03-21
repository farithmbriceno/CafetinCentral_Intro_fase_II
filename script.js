const accounts = [
  { username: 'ClienteUCV', password: 'Central_123', role: 'client', display: 'Clientela' },
  { username: 'caja_01', password: 'Cajero#123', role: 'cashier', display: 'Personal de Caja' },
  {
    username: 'adminRoot',
    password: 'cafetinAdmin',
    role: 'admin',
    display: 'Personal de Administración'
  }
];

const state = {
  currentUser: null,
  products: [
    { id: 1, name: 'Empanada de Queso', price: 1.5, image: 'imagenes/empanada.jpg' },
    { id: 2, name: 'Jugo de Mango', price: 1.2, image: 'imagenes/jugo-mango.jpg' },
    { id: 3, name: 'Arepa de Pollo', price: 2.1, image: 'imagenes/arepa-pollo.jpg' },
    { id: 4, name: 'Café Negro', price: 0.9, image: 'imagenes/cafe-negro.jpg' }
  ],
  clientCart: [],
  clientHistory: [
    {
      id: 'H-001',
      date: '2026-03-10',
      items: ['Empanada de Queso', 'Café Negro'],
      total: 2.4
    },
    { id: 'H-002', date: '2026-03-14', items: ['Arepa de Pollo'], total: 2.1 }
  ],
  cashierCart: []
};

const loginView = document.getElementById('login-view');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const welcome = document.getElementById('welcome');
const logoutBtn = document.getElementById('logout-btn');

const clientView = document.getElementById('client-view');
const catalog = document.getElementById('catalog');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutMessage = document.getElementById('checkout-message');
const historyList = document.getElementById('purchase-history');

const cashierView = document.getElementById('cashier-view');
const cashierProducts = document.getElementById('cashier-products');
const cashierOrder = document.getElementById('cashier-order');
const cashierTotal = document.getElementById('cashier-total');
const emitReceiptBtn = document.getElementById('emit-receipt-btn');
const receiptMessage = document.getElementById('receipt-message');

const adminView = document.getElementById('admin-view');
const addProductForm = document.getElementById('add-product-form');
const adminProducts = document.getElementById('admin-products');
const adminMessage = document.getElementById('admin-message');

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderRoleView() {
  clientView.classList.add('hidden');
  cashierView.classList.add('hidden');
  adminView.classList.add('hidden');

  if (!state.currentUser) {
    return;
  }

  if (state.currentUser.role === 'client') {
    clientView.classList.remove('hidden');
    renderCatalogForClient();
    renderClientCart();
    renderClientHistory();
  }

  if (state.currentUser.role === 'cashier') {
    cashierView.classList.remove('hidden');
    renderCashierProducts();
    renderCashierCart();
  }

  if (state.currentUser.role === 'admin') {
    adminView.classList.remove('hidden');
    renderAdminProducts();
  }
}

function renderCatalogForClient() {
  catalog.innerHTML = '';

  state.products.forEach((product) => {
    const row = document.createElement('div');
    row.className = 'product-item';
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong><br>
        <small>$${formatCurrency(product.price)} · ${product.image}</small>
      </div>
    `;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Añadir al carrito';
    addBtn.addEventListener('click', () => {
      state.clientCart.push(product);
      renderClientCart();
    });

    row.appendChild(addBtn);
    catalog.appendChild(row);
  });
}

function renderClientCart() {
  cartItems.innerHTML = '';
  const subtotal = state.clientCart.reduce((acc, item) => acc + item.price, 0);
  cartCount.textContent = String(state.clientCart.length);
  cartSubtotal.textContent = formatCurrency(subtotal);

  if (!state.clientCart.length) {
    cartItems.innerHTML = '<li>No hay productos en el carrito.</li>';
    return;
  }

  state.clientCart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item.name} - $${formatCurrency(item.price)}`;
    cartItems.appendChild(li);
  });
}

function renderClientHistory() {
  historyList.innerHTML = '';

  state.clientHistory.forEach((purchase) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${purchase.id}</strong> (${purchase.date}) — ${purchase.items.join(', ')} — Total: $${formatCurrency(purchase.total)}`;
    historyList.appendChild(li);
  });
}

function renderCashierProducts() {
  cashierProducts.innerHTML = '';

  state.products.forEach((product) => {
    const row = document.createElement('div');
    row.className = 'product-item';
    row.innerHTML = `<div><strong>${product.name}</strong><br><small>$${formatCurrency(product.price)}</small></div>`;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Agregar a venta';
    addBtn.addEventListener('click', () => {
      state.cashierCart.push(product);
      renderCashierCart();
    });

    row.appendChild(addBtn);
    cashierProducts.appendChild(row);
  });
}

function renderCashierCart() {
  cashierOrder.innerHTML = '';
  const total = state.cashierCart.reduce((acc, item) => acc + item.price, 0);
  cashierTotal.textContent = formatCurrency(total);

  if (!state.cashierCart.length) {
    cashierOrder.innerHTML = '<li>Aún no se ha capturado ningún producto.</li>';
    return;
  }

  state.cashierCart.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${formatCurrency(item.price)}`;
    cashierOrder.appendChild(li);
  });
}

function renderAdminProducts() {
  adminProducts.innerHTML = '';

  state.products.forEach((product) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${product.name}</strong> - $${formatCurrency(product.price)} <small>(${product.image})</small> `;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', () => {
      state.products = state.products.filter((item) => item.id !== product.id);
      adminMessage.textContent = `Producto "${product.name}" eliminado del menú.`;
      renderAdminProducts();
      renderCatalogForClient();
      renderCashierProducts();
    });

    li.appendChild(delBtn);
    adminProducts.appendChild(li);
  });
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginMessage.textContent = '';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const account = accounts.find((item) => item.username === username && item.password === password);

  if (!account) {
    loginMessage.textContent = 'Credenciales inválidas. Intente nuevamente.';
    return;
  }

  state.currentUser = account;
  loginView.classList.add('hidden');
  dashboard.classList.remove('hidden');
  welcome.textContent = `Sesión activa: ${account.display} (${account.username})`;
  checkoutMessage.textContent = '';
  receiptMessage.textContent = '';
  adminMessage.textContent = '';
  renderRoleView();
});

logoutBtn.addEventListener('click', () => {
  state.currentUser = null;
  state.clientCart = [];
  state.cashierCart = [];
  loginView.classList.remove('hidden');
  dashboard.classList.add('hidden');
  loginForm.reset();
});

checkoutBtn.addEventListener('click', () => {
  if (!state.clientCart.length) {
    checkoutMessage.textContent = 'Debe añadir productos al carrito para confirmar.';
    return;
  }

  const total = state.clientCart.reduce((acc, item) => acc + item.price, 0);
  const nextId = `H-00${state.clientHistory.length + 1}`;
  const today = new Date().toISOString().slice(0, 10);

  state.clientHistory.unshift({
    id: nextId,
    date: today,
    items: state.clientCart.map((item) => item.name),
    total
  });

  state.clientCart = [];
  checkoutMessage.textContent = 'Pedido registrado de forma simulada.';
  renderClientCart();
  renderClientHistory();
});

emitReceiptBtn.addEventListener('click', () => {
  if (!state.cashierCart.length) {
    receiptMessage.textContent = 'No hay productos en la venta actual.';
    return;
  }

  receiptMessage.textContent = 'Recibo Emitido. ¡Gracias por su compra!';
  state.cashierCart = [];
  renderCashierCart();
});

addProductForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('new-product-name').value.trim();
  const priceValue = Number(document.getElementById('new-product-price').value);
  const image = document.getElementById('new-product-image').value.trim();

  if (!name || Number.isNaN(priceValue) || priceValue < 0 || !image) {
    adminMessage.textContent = 'Complete correctamente todos los campos.';
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: priceValue,
    image
  };

  state.products.push(newProduct);
  addProductForm.reset();
  adminMessage.textContent = `Producto "${name}" agregado temporalmente al menú.`;
  renderAdminProducts();
  renderCatalogForClient();
  renderCashierProducts();
});
