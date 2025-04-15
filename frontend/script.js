const apiURL = 'http://localhost:5000/api/products';

const form = document.getElementById('product-form');
const table = document.getElementById('product-table');

// Load products on page load
window.onload = loadProducts;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const product = {
    name: form.name.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    category: form.category.value,
  };

  await fetch(apiURL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product)
  });

  form.reset();
  loadProducts();
});

async function loadProducts() {
  const res = await fetch(apiURL);
  const products = await res.json();
  table.innerHTML = '';

  products.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input value="${p.name}" onchange="updateField(${p.id}, 'name', this.value)" /></td>
      <td><input type="number" value="${p.price}" onchange="updateField(${p.id}, 'price', this.value)" /></td>
      <td><input type="number" value="${p.stock}" onchange="updateField(${p.id}, 'stock', this.value)" /></td>
      <td><input value="${p.category}" onchange="updateField(${p.id}, 'category', this.value)" /></td>
      <td><button onclick="deleteProduct(${p.id})">Delete</button></td>
    `;
    table.appendChild(row);
  });
}

async function updateField(id, field, value) {
  const res = await fetch(`${apiURL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ [field]: value })
  });

  if (res.ok) loadProducts();
}

async function deleteProduct(id) {
  await fetch(`${apiURL}/${id}`, {
    method: 'DELETE'
  });
  loadProducts();
}
