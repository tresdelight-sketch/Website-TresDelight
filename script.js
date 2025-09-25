// ========== DATA PRODUK (HANYA UNTUK FUNGSI CART) ==========
const products = [
  {id: 1, name: 'Wonton Chili Oil', price: 5000},
  {id: 2, name: 'Es Kuwut Segar', price: 5000},
  {id: 3, name: 'Paket Combo Josjis', price: 8000}
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== LOGIN / LOGOUT ==========
function login() {
  const val = document.getElementById('username').value.trim();
  if (!val) return alert('Isi nama kamu dulu ya');
  localStorage.setItem('user', val);
  document.getElementById('loginModal').style.display = 'none';
}
function logout() {
  if (confirm('Yakin keluar?')) {
    localStorage.clear();
    location.reload();
  }
}

// ========== KERANJANG ==========
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const idx = cart.findIndex(x => x.id === id);
  idx === -1 ? cart.push({...p, qty: 1}) : cart[idx].qty++;
  saveCart();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}
function plusQty(id) {
  cart.find(x => x.id === id).qty++;
  saveCart();
}
function minusQty(id) {
  const c = cart.find(x => x.id === id);
  c.qty === 1 ? removeFromCart(id) : (c.qty--, saveCart());
}
function renderCart() {
  const cont = document.getElementById('cartItems');
  const totalEl = document.getElementById('totalPrice');
  const countEl = document.getElementById('cartCount');
  if (!cart.length) {
    cont.innerHTML = '<p>Keranjang kosong</p>';
    totalEl.textContent = '0';
    countEl.textContent = '0';
    return;
  }
  cont.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">Rp ${(c.price * c.qty).toLocaleString('id')}</div>
      </div>
      <div class="cart-item-actions">
        <button class="btn-minus" onclick="minusQty(${c.id})">-</button>
        <span>${c.qty}</span>
        <button class="btn-plus" onclick="plusQty(${c.id})">+</button>
        <button class="btn-remove" onclick="removeFromCart(${c.id})">Hapus</button>
      </div>
    </div>`).join('');
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
  totalEl.textContent = total.toLocaleString('id');
  countEl.textContent = cart.reduce((a, b) => a + b.qty, 0);
}
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
}
function closeNav() {
  document.getElementById('navToggle').checked = false;
}
function checkoutWhatsApp() {
  if (!cart.length) return alert('Keranjang masih kosong');
  const user = localStorage.getItem('user');
  let text = `Halo, pesanan dari *${user}*:%0A%0A`;
  cart.forEach(c => {
    text += `- ${c.name} x${c.qty} = Rp ${(c.price * c.qty).toLocaleString('id')}%0A`;
  });
  const grand = cart.reduce((a, b) => a + b.price * b.qty, 0);
  text += `%0ATotal: *Rp ${grand.toLocaleString('id')}*%0A%0ATerima kasih!`;
  window.open(`https://wa.me/6282132719212?text=${text}`, '_blank');
}

// ========== INITIALIZE ==========
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('user')) document.getElementById('loginModal').style.display = 'flex';
  renderCart();
});