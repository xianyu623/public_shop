const products = [
  {
    id: 1,
    name: '紅色皮克敏吊飾',
    tag: '人氣款',
    category: 'red',
    emoji: '🟢',
    price: 420,
    description: '顏色鮮亮、適合背包與鑰匙圈，帶著小小勇氣踏上每段冒險。'
  },
  {
    id: 2,
    name: '藍色皮克敏吊飾',
    tag: '清新款',
    category: 'blue',
    emoji: '🔵',
    price: 450,
    description: '海洋感色調與輕盈造型，像是一路冒險都伴隨著清涼微風。'
  },
  {
    id: 3,
    name: '黃色皮克敏吊飾',
    tag: '好運款',
    category: 'yellow',
    emoji: '🟡',
    price: 430,
    description: '明亮活力的黃色，最適合放在手機背蓋或行李識別上。'
  },
  {
    id: 4,
    name: '岩石皮克敏吊飾',
    tag: '限定款',
    category: 'special',
    emoji: '🪨',
    price: 520,
    description: '帶著堅實穩定感的特殊造型，收藏感十足，是大器小物。'
  },
  {
    id: 5,
    name: '翼型皮克敏吊飾',
    tag: '飛翔款',
    category: 'special',
    emoji: '🩷',
    price: 560,
    description: '小小翅膀飛上天，讓旅程立刻多出一點自由與童趣。'
  },
  {
    id: 6,
    name: '彩虹皮克敏吊飾',
    tag: '收藏款',
    category: 'yellow',
    emoji: '🌈',
    price: 590,
    description: '多彩陣容讓每個揹包都像是展開一段小型奇幻冒險。'
  },
  {
    id: 7,
    name: '隊員組合吊飾',
    tag: '團隊款',
    category: 'red',
    emoji: '🎒',
    price: 680,
    description: '三色組合設計，適合送給想帶著一整隊幸福的親友。'
  },
  {
    id: 8,
    name: '月光皮克敏吊飾',
    tag: '夜巡款',
    category: 'blue',
    emoji: '🌙',
    price: 620,
    description: '柔和夜光感與銀白底，夜晚出遊也能有浪漫與安心感。'
  }
];

const cart = [];

const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartPanel = document.getElementById('cart-panel');

function formatPrice(value) {
  return `NT$ ${value.toLocaleString()}`;
}

function renderProducts(filter = 'all') {
  const visibleProducts = filter === 'all' ? products : products.filter((product) => product.category === filter);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <div class="emoji">${product.emoji}</div>
          </div>
          <div class="product-body">
            <span class="product-tag">${product.tag}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="add-button" type="button" data-id="${product.id}">加入購物車</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.add-button').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateCartItem(productId, amount) {
  const target = cart.find((item) => item.id === productId);
  if (!target) return;

  target.quantity += amount;

  if (target.quantity <= 0) {
    const index = cart.findIndex((item) => item.id === productId);
    cart.splice(index, 1);
  }

  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `NT$ ${totalPrice.toLocaleString()}`;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">目前沒有商品</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="item-thumb">${item.emoji}</div>
          <div class="item-meta">
            <h4>${item.name}</h4>
            <p>${formatPrice(item.price)}</p>
            <div class="quantity-control">
              <button type="button" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="item-price">${formatPrice(item.quantity * item.price)}</div>
        </div>
      `
    )
    .join('');

  cartItems.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.id);
      const action = button.dataset.action;
      updateCartItem(productId, action === 'increase' ? 1 : -1);
    });
  });
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
});

document.querySelector('.cart-button').addEventListener('click', () => {
  cartPanel.classList.add('open');
});

document.querySelector('.close-cart').addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

renderProducts();
renderCart();
