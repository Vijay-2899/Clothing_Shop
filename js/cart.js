let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElements = document.querySelectorAll('#cart-count');
  countElements.forEach(el => {
    el.textContent = cart.length;
  });
}

// Initialize cart count
updateCartCount();