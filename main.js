// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
  });
  
  // Load products from backend API
  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error("Error:", error);
      document.getElementById('products-container').innerHTML = `
        <p class="error">Failed to load products. Please try again later.</p>
      `;
    }
  }
  
  // Render products to HTML
  function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="assets/${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>€${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `).join('');
  }
  
  // Cart functionality
  async function addToCart(productId) {
    try {
      const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      if (!response.ok) throw new Error("Failed to add to cart");
      updateCartCount();
    } catch (error) {
      alert("Failed to add item to cart");
    }
  }
  
  // Update cart counter
  function updateCartCount() {
    fetch('http://localhost:3000/cart')
      .then(res => res.json())
      .then(cart => {
        document.getElementById('cart-count').textContent = cart.length;
      });
  }