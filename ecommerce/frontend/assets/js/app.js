import { CONFIG } from './config.js';
import { 
  validateEmail, 
  checkPasswordStrength, 
  registerUser, 
  loginUser, 
  setAuthSession, 
  getAuthUser, 
  logout 
} from './auth.js';

/* CATÁLOGO DE PRODUTOS  */
export const products = [
  {
    id: 1,
    title: "Conjunto Rendado Aurora",
    price: 189.90,
    installments: "3x de R$ 63,30 sem juros",
    sizes: ["P", "M", "G", "GG"],
    image: "assets/images/produtos/conjunto-aurora.jpg",
    category: "conjuntos"
  },
  {
    id: 2,
    title: "Body Seda & Tule Noir",
    price: 229.80,
    installments: "4x de R$ 57,45 sem juros",
    sizes: ["P", "M", "G"],
    image: "assets/images/produtos/body-noir.jpg",
    category: "noite"
  },
  {
    id: 3,
    title: "Sutiã Bralette Soft Touch",
    price: 119.90,
    installments: "2x de R$ 59,95 sem juros",
    sizes: ["P", "M", "G", "GG"],
    image: "assets/images/produtos/bralette-soft.jpg",
    category: "sutias"
  },
  {
    id: 4,
    title: "Robe Acetinado Sublime",
    price: 249.90,
    installments: "4x de R$ 62,47 sem juros",
    sizes: ["Único"],
    image: "assets/images/produtos/robe-sublime.jpg",
    category: "noite"
  }
];

/* ESTADO GLOBAL DO CARRINHO E SELEÇÃO */
let cart = [];
const selectedSizes = {};

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("lumina_cart");
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Erro ao carregar carrinho:", e);
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("lumina_cart", JSON.stringify(cart));
  updateCartUI();
}

/*  3. RENDERIZAÇÃO DA VITRINE DE PRODUTOS  */
function filterProducts(category = 'todos') {
  const container = document.getElementById("productGrid");
  if (!container) return;

  // Atualiza a classe 'active' nos botões de filtro
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(category));
  if (activeBtn) activeBtn.classList.add('active');

  // Filtra os produtos
  const filteredProducts = category === 'todos' 
    ? products 
    : products.filter(prod => prod.category === category);

  // Injeta no HTML
  container.innerHTML = filteredProducts.map(prod => {
    const safeTitle = prod.title.replace(/'/g, "\\'"); 
    return `
      <div class="product-card" data-id="${prod.id}">
        <div class="product-image-container">
          <img src="${prod.image}" alt="${prod.title}" onerror="this.src='https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'">
        </div>
        <div class="product-info">
          <h3 class="product-title">${prod.title}</h3>
          <p class="product-price">R$ ${prod.price.toFixed(2).replace('.', ',')}</p>
          <span class="product-installments">${prod.installments}</span>

          <div class="size-selector">
            ${prod.sizes.map((s, idx) => `
              <button type="button" 
                      class="size-btn ${idx === 1 || prod.sizes.length === 1 ? 'active' : ''}" 
                      data-product-id="${prod.id}" 
                      onclick="selectSize(${prod.id}, '${s}', this)">
                ${s}
              </button>
            `).join('')}
          </div>

          <button type="button" class="btn-buy" onclick="addToCart(${prod.id}, '${safeTitle}', ${prod.price})">
            Adicionar à Sacola
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* FUNÇÕES DO CARRINHO E TAMANHOS */
function selectSize(productId, size, buttonElement) {
  selectedSizes[productId] = size;

  const parent = buttonElement ? buttonElement.closest('.product-card') : document;
  const buttons = parent.querySelectorAll(`.size-btn[data-product-id="${productId}"]`);
  buttons.forEach(b => b.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');
}

function addToCart(productId, title, price, defaultSize = 'M') {
  const size = selectedSizes[productId] || defaultSize;
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);

  if (existingIndex > -1) {
    cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
  } else {
    cart.push({
      id: productId,
      title: title,
      price: Number(price),
      size: size,
      qty: 1
    });
  }

  saveCart();

  const cartDrawer = document.getElementById("cartDrawer") || document.getElementById("cartSidebar");
  if (cartDrawer && !cartDrawer.classList.contains("open")) {
    cartDrawer.classList.add("open");
  }
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
  }
}

function toggleCart() {
  const cartDrawer = document.getElementById("cartDrawer") || document.getElementById("cartSidebar");
  if (cartDrawer) {
    cartDrawer.classList.toggle("open");
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("A sua sacola está vazia!");
    return;
  }
  window.location.href = "pages/checkout.html";
}

function updateCartUI() {
  const cartCountEl = document.getElementById("cartCount");
  const cartItemsContainer = document.getElementById("cartItems") || document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");

  const totalUnits = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  if (cartCountEl) cartCountEl.textContent = totalUnits;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">A sua sacola está vazia.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-size">Tam: ${item.size}</span>
        <span class="cart-item-price">${Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" type="button" onclick="changeQty(${idx}, -1)">-</button>
        <span class="qty-num">${item.qty || 1}</span>
        <button class="qty-btn" type="button" onclick="changeQty(${idx}, 1)">+</button>
        <button class="remove-btn" type="button" onclick="removeFromCart(${idx})" title="Remover">&times;</button>
      </div>
    </div>
  `).join('');
}

/* 5. GUIA DE MEDIDAS */
function openSizeGuide() {
  const modal = document.getElementById("sizeGuideModal") || document.getElementById("sizeModal");
  if (modal) modal.style.display = "flex";
}

function closeSizeGuide() {
  const modal = document.getElementById("sizeGuideModal") || document.getElementById("sizeModal");
  if (modal) modal.style.display = "none";
}

/* 6. EXPOSIÇÃO GLOBAL NO OBJETO WINDOW (Essencial para onclick no HTML) */
window.openSizeGuide = openSizeGuide;
window.closeSizeGuide = closeSizeGuide;
window.toggleCart = toggleCart;
window.selectSize = selectSize;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.filterProducts = filterProducts;

/* 7. INICIALIZAÇÃO E CONTROLE DE AUTENTICAÇÃO */
document.addEventListener('DOMContentLoaded', () => {
  filterProducts('todos');
  loadCartFromStorage();
  updateCartUI();

  // Elementos do Modal de Autenticação
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const tabLogin = document.getElementById('tabLoginBtn');
  const tabRegister = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const btnOpenAuth = document.getElementById('btnOpenAuth');

  // Atualiza saudação se já estiver autenticado
  const currentUser = getAuthUser();
  if (currentUser && btnOpenAuth) {
    const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Conta';
    btnOpenAuth.textContent = `👤 Olá, ${firstName}`;
  }

  if (btnOpenAuth && authModal) {
    btnOpenAuth.addEventListener('click', (e) => {
      const href = btnOpenAuth.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        authModal.style.display = 'flex';
      }
    });
  }

  if (closeAuthModal && authModal) {
    closeAuthModal.onclick = () => authModal.style.display = 'none';
  }

  // Alternar Abas do Modal
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister?.classList.remove('active');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin?.classList.remove('active');
    if (registerForm) registerForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
  });

  // Validador de Senha Forte
  const regPasswordInput = document.getElementById('regPassword');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const btnRegister = document.getElementById('btnRegisterSubmit');

  regPasswordInput?.addEventListener('input', (e) => {
    const pwd = e.target.value;
    const { requirements, isStrong, score } = checkPasswordStrength(pwd);

    const updateChecklist = (id, valid, text) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = valid ? 'valid' : '';
        el.textContent = `${valid ? '✔' : '✖'} ${text}`;
      }
    };

    updateChecklist('rule-len', requirements.length, 'Mínimo de 8 caracteres');
    updateChecklist('rule-upper', requirements.uppercase, 'Pelo menos 1 letra maiúscula');
    updateChecklist('rule-lower', requirements.lowercase, 'Pelo menos 1 letra minúscula');
    updateChecklist('rule-num', requirements.number, 'Pelo menos 1 número');
    updateChecklist('rule-spec', requirements.specialChar, 'Pelo menos 1 caractere especial (@$!%*?&#)');

    const colors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#2e7d32'];
    const labels = ['Muito Fraca', 'Fraca', 'Média', 'Boa', 'Excelente'];
    
    if (strengthBar) {
      strengthBar.style.width = `${(score / 5) * 100}%`;
      strengthBar.style.backgroundColor = colors[Math.max(0, score - 1)] || '#eee';
    }
    if (strengthText) {
      strengthText.textContent = pwd.length > 0 ? labels[Math.max(0, score - 1)] : 'Segurança da senha';
    }

    if (btnRegister) btnRegister.disabled = !isStrong;
  });

  // Envio de Cadastro
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = regPasswordInput?.value;
    const emailError = document.getElementById('regEmailError');

    if (emailError) emailError.textContent = '';

    if (!validateEmail(email)) {
      if (emailError) emailError.textContent = 'Insira um e-mail válido.';
      return;
    }

    try {
      if (btnRegister) {
        btnRegister.disabled = true;
        btnRegister.textContent = 'A criar conta...';
      }
      const user = await registerUser({ fullName, email, password });
      setAuthSession(user);
      alert('Conta criada com sucesso!');
      if (authModal) authModal.style.display = 'none';
      if (btnOpenAuth) btnOpenAuth.textContent = `👤 Olá, ${fullName.split(' ')[0]}`;
    } catch (err) {
      alert(err.message || 'Erro ao realizar cadastro.');
    } finally {
      if (btnRegister) {
        btnRegister.disabled = false;
        btnRegister.textContent = 'Criar Conta';
      }
    }
  });

  // Envio de Login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const emailError = document.getElementById('loginEmailError');
    const btnLogin = document.getElementById('btnLoginSubmit');

    if (emailError) emailError.textContent = '';

    if (!validateEmail(email)) {
      if (emailError) emailError.textContent = 'E-mail com formato inválido.';
      return;
    }

    try {
      if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = 'A entrar...';
      }
      const user = await loginUser({ email, password });
      setAuthSession(user);
      alert(`Bem-vinda(o) de volta, ${user.fullName}!`);
      if (authModal) authModal.style.display = 'none';
      if (btnOpenAuth) btnOpenAuth.textContent = `👤 Olá, ${user.fullName.split(' ')[0]}`;
    } catch (err) {
      alert(err.message || 'Credenciais inválidas.');
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Entrar';
      }
    }
  });
});