document.addEventListener("DOMContentLoaded", function() {
  const initialStock = {
      'blue-jeans-stock': 10,
      'black-jeans-stock': 10,
      'skinny-jeans-stock': 10,
      'distressed-jeans-stock': 10,
      'denim-shorts-stock': 10,
      'graphic-tshirt-stock': 10,
      'white-tshirt-stock': 10,
      'vneck-tshirt-stock': 10,
      'polo-shirt-stock': 10,
      'longsleeve-tshirt-stock': 10,
      'calvin-klein-perfume-stock': 10,
      'chanel-perfume-stock': 10,
      'dolce-gabbana-perfume-stock': 10,
      'hugo-boss-perfume-stock': 10,
      'striped-tank-top-stock': 10,
      'white-tank-top-stock': 10,
      'black-tank-top-stock': 10,
      'sportswear-tank-top-stock': 10,
      'teddy-bear-stock': 10,
      'yo-yo-stock': 10,
      'remote-control-car-stock': 10
  };

  // Initialize stock in localStorage if not already set
  for (const [key, value] of Object.entries(initialStock)) {
      if (localStorage.getItem(key) === null) {
          localStorage.setItem(key, value);
      }
  }

  updateStockDisplay();
});

function updateStockDisplay() {
  const stockElements = document.querySelectorAll('.stock span');
  stockElements.forEach(stockElement => {
      const stockId = stockElement.id;
      const stockCount = localStorage.getItem(stockId);
      stockElement.textContent = stockCount;
  });
}

let cart = [];

function addToCart(name, price, stockId) {
  const stockElement = document.getElementById(stockId);
  let stockCount = parseInt(localStorage.getItem(stockId));

  if (stockCount <= 0) {
      alert("Sorry, this item is out of stock!");
      return;
  }

  stockCount--;
  localStorage.setItem(stockId, stockCount);
  stockElement.textContent = stockCount;

  const existingItemIndex = cart.findIndex(item => item.name === name);
  if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity++;
  } else {
      cart.push({ name, price, quantity: 1, stockId });
  }

  renderCart();
}

function removeFromCart(index) {
  const removedItem = cart.splice(index, 1)[0];
  const stockElement = document.getElementById(removedItem.stockId);
  let stockCount = parseInt(localStorage.getItem(removedItem.stockId)) + removedItem.quantity;
  localStorage.setItem(removedItem.stockId, stockCount);
  stockElement.textContent = stockCount;
  renderCart();
}

function adjustQuantity(index, operation) {
  const existingItem = cart[index];
  const stockElement = document.getElementById(existingItem.stockId);
  let stockCount = parseInt(localStorage.getItem(existingItem.stockId));

  if (operation === 'toAdd') {
      if (stockCount <= 0) {
          alert("Sorry, this item is out of stock!");
          return;
      }
      existingItem.quantity++;
      stockCount--;
  } else if (operation === 'toReduce') {
      if (existingItem.quantity > 1) {
          existingItem.quantity--;
          stockCount++;
      } else {
          removeFromCart(index);
          return;
      }
  }

  localStorage.setItem(existingItem.stockId, stockCount);
  stockElement.textContent = stockCount;
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cart');
  cartList.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
      const cartItem = document.createElement('li');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <span>${item.name}</span>
          <div>
              <button onclick="adjustQuantity(${index}, 'toReduce')">-</button>
              <span>${item.quantity}</span>
              <button onclick="adjustQuantity(${index}, 'toAdd')">+</button>
          </div>
          <span>₱${(item.price * item.quantity).toFixed(2)}</span>
          <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartList.appendChild(cartItem);

      total += item.price * item.quantity;
  });

  document.getElementById('total').textContent = "₱" + total.toFixed(2);
}

function checkout() {
  alert('Thank you for your purchase!');
  cart = [];
  renderCart();
}

function applyDiscount() {
  const discountElements = document.getElementsByName('discount');
  let selectedDiscount = 0;

  for (const discountElement of discountElements) {
      if (discountElement.checked) {
          selectedDiscount = parseInt(discountElement.value);
          break;
      }
  }

  if (selectedDiscount === 0) {
    // No discount selected, keep the total unchanged
    renderCart();
    return;
  }

  let total = 0;
  cart.forEach(item => {
      total += item.price * item.quantity;
  });

  const discountedTotal = total - (total * (selectedDiscount / 100));
  document.getElementById('total').textContent = "₱" + discountedTotal.toFixed(2);

  // Update the cart with the discounted total
  cartTotal = discountedTotal;
}
