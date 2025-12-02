

/* ----------- BOOK OBJECT------------ */
const BOOKS = [
  { id: 'b1', title: 'Java 2', author: 'Watson', publication: 'BPB Publications', price: 35.5 , cover: "java.png"},
  { id: 'b2', title: 'HTML in 24 Hours', author: 'Sam Peter', publication: 'Sam Publication', price: 50,  cover: "html.jpg"},
  { id: 'b3', title: 'XML Bible', author: 'Winston', publication: 'Wiley', price: 40.5 , cover: "bible.jpg"},
  { id: 'b4', title: 'Artificial Intelligence', author: 'S. Russel', publication: 'Princeton Hall', price: 63 , cover: "ai.jpg"}
];

/* ------------ CART STORAGE ------------ */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

/* ------------ CATALOGUE RENDERING ------------ */
function renderCatalogue() {
  const grid = document.getElementById("booksGrid");
  if (!grid) return;

  grid.innerHTML = "";

  BOOKS.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-thumb">
        <img src="${book.cover}" alt="${book.title}">
      </div>

      <div class="book-info">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Publication:</strong> ${book.publication}</p>
        <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      </div>

      <div class="book-actions">
        <button onclick="addToCart('${book.id}')">Add to Cart</button>
      </div>
    `;

    grid.appendChild(card);
  });
}


/* ------------ ADD TO CART ------------ */
function addToCart(bookId) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === bookId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${book.title} added to cart.`);
}

/* ------------ CART PAGE RENDERING ------------ */
function renderCart() {
  const area = document.getElementById("cartArea");
  if (!area) return;

  const cart = getCart();

  /* If empty */
  if (cart.length === 0) {
    area.innerHTML = `
      <p>Your cart is empty.  
      Visit the <a href="catalogue.html">Catalogue</a> to add books.</p>`;
    updateCartCount();
    return;
  }

  let html = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Book</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach(item => {
    html += `
      <tr>
        <td>${item.title}</td>
        <td>$${item.price.toFixed(2)}</td>

        <td>
          <div class="qty-controls">
            <button class="small-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span class="qty">${item.quantity}</span>
            <button class="small-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </td>

        <td>$${(item.price * item.quantity).toFixed(2)}</td>

        <td>
          <button class="small-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </td>
      </tr>
    `;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  html += `
      </tbody>
    </table>

    <p style="font-weight:600; margin-top:10px;">
      Total Amount: $${total.toFixed(2)}
    </p>

    <button onclick="checkout()" class="small-btn">Checkout</button>
  `;

  area.innerHTML = html;

  updateCartCount();
}

/* ------------ CHANGE QUANTITY ------------ */
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

/* ------------ REMOVE ITEM ------------ */
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);

  saveCart(cart);
  renderCart();
}

/* ------------ CHECKOUT ------------ */
function checkout() {
  if (!confirm("Proceed to checkout? (This is a demo only.)")) return;

  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();

  alert("Thank you for your purchase!");
}

/* ------------ REGISTRATION ------------ */
function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !password || !email) {
    alert("Please fill all required fields.");
    return;
  }

  const user = { name, password, email, phone, address };
  localStorage.setItem("user", JSON.stringify(user));

  alert("Registration successful!");
  window.location.href = "login.html";
}

/* ------------ LOGIN ------------ */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (email === user.email && password === user.password) {
    alert(`Welcome, ${user.name}!`);
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password!");
  }
}

/* ------------ INITIAL SETUP ON PAGE LOAD ------------ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCatalogue();
  renderCart();
});
