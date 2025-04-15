async function loadProducts(category) {
    try {
      const response = await fetch(`http://localhost:3000/products?category=${category}`);
      const products = await response.json();
      
      const container = document.getElementById('products');
      container.innerHTML = products.map(product => `
        <div class="product-card">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }