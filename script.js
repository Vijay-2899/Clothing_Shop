document.addEventListener('DOMContentLoaded', () => {
  // API Base URL
  const API_URL = 'http://localhost:3000/api/products';
  
  // DOM Elements
  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const categoryFilter = document.getElementById('category-filter');
  
  // Load products on page load
  loadProducts();
  
  // Form submission handler
  productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(productForm);
      const productData = {
          name: formData.get('name'),
          price: parseFloat(formData.get('price')),
          category: formData.get('category')
      };
      
      try {
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(productData)
          });
          
          if (!response.ok) throw new Error('Failed to create product');
          
          productForm.reset();
          loadProducts();
      } catch (error) {
          console.error('Error creating product:', error);
          alert('Error creating product. Please try again.');
      }
  });
  
  // Category filter handler
  categoryFilter.addEventListener('change', () => {
      loadProducts(categoryFilter.value);
  });
  
  // Load products function
  async function loadProducts(category = '') {
      try {
          const url = category ? `${API_URL}?category=${category}` : API_URL;
          const response = await fetch(url);
          
          if (!response.ok) throw new Error('Failed to fetch products');
          
          const products = await response.json();
          displayProducts(products);
      } catch (error) {
          console.error('Error loading products:', error);
          alert('Error loading products. Please try again.');
      }
  }
  
  // Display products function
  function displayProducts(products) {
      productList.innerHTML = products.map(product => `
          <div class="product-card" data-id="${product.id}">
              <h3>${product.name}</h3>
              <p>Price: $${product.price.toFixed(2)}</p>
              <p>Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              <div class="product-actions">
                  <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                  <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
              </div>
          </div>
      `).join('');
  }
  
  // Global functions for edit/delete
  window.editProduct = async (id) => {
      try {
          const response = await fetch(`${API_URL}/${id}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          
          const product = await response.json();
          
          // Fill the form with product data
          document.getElementById('product-id').value = product.id;
          document.getElementById('name').value = product.name;
          document.getElementById('price').value = product.price;
          document.getElementById('category').value = product.category;
          
          // Change form button to "Update"
          productForm.querySelector('button[type="submit"]').textContent = 'Update Product';
          
          // Change form submit handler to update instead of create
          productForm.onsubmit = async (e) => {
              e.preventDefault();
              
              const formData = new FormData(productForm);
              const updatedData = {
                  name: formData.get('name'),
                  price: parseFloat(formData.get('price')),
                  category: formData.get('category')
              };
              
              try {
                  const updateResponse = await fetch(`${API_URL}/${id}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(updatedData)
                  });
                  
                  if (!updateResponse.ok) throw new Error('Failed to update product');
                  
                  productForm.reset();
                  productForm.querySelector('button[type="submit"]').textContent = 'Add Product';
                  productForm.onsubmit = handleFormSubmit; // Reset to original handler
                  loadProducts();
              } catch (error) {
                  console.error('Error updating product:', error);
                  alert('Error updating product. Please try again.');
              }
          };
      } catch (error) {
          console.error('Error fetching product for edit:', error);
          alert('Error loading product for editing. Please try again.');
      }
  };
  
  window.deleteProduct = async (id) => {
      if (!confirm('Are you sure you want to delete this product?')) return;
      
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete product');
          
          loadProducts();
      } catch (error) {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
      }
  };
  
  // Store original form submit handler
  const handleFormSubmit = productForm.onsubmit;
});