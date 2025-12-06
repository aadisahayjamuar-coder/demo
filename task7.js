// Basic in-memory data
let books = [
  { title: "Atomic Habits", author: "James Clear", price: 499, rating: 4.8 },
  { title: "Deep Work", author: "Cal Newport", price: 349, rating: 4.5 },
  { title: "Clean Code", author: "Robert C. Martin", price: 799, rating: 4.7 },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 699, rating: 4.6 }
];

// DOM refs
const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const priceInput = document.getElementById("priceInput");
const ratingInput = document.getElementById("ratingInput");
const addBtn = document.getElementById("addBtn");

// ---------- Render ----------

function renderBooks() {
  const term = searchInput.value.trim().toLowerCase();

  let filtered = books.filter(b => {
    const haystack = `${b.title} ${b.author}`.toLowerCase();
    return haystack.includes(term);
  });

  const sortValue = sortSelect.value;
  if (sortValue === "low-high") {
    filtered = filtered.slice().sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    filtered = filtered.slice().sort((a, b) => b.price - a.price);
  }

  bookList.innerHTML = "";

  if (!filtered.length) {
    bookList.innerHTML =
      '<p class="text-center text-muted py-4">No books match your search.</p>';
    return;
  }

  filtered.forEach((book, index) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    const card = document.createElement("article");
    card.className = "book-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `${book.title} by ${book.author}`);

    const header = document.createElement("div");
    header.className = "book-header";

    const titleWrap = document.createElement("div");

    const titleEl = document.createElement("h5");
    titleEl.className = "book-title mb-0";
    titleEl.textContent = book.title;

    const authorEl = document.createElement("p");
    authorEl.className = "book-author mb-0";
    authorEl.textContent = book.author;

    titleWrap.appendChild(titleEl);
    titleWrap.appendChild(authorEl);

    const priceEl = document.createElement("span");
    priceEl.className = "book-price";
    priceEl.textContent = `₹${book.price}`;

    header.appendChild(titleWrap);
    header.appendChild(priceEl);

    const meta = document.createElement("div");
    meta.className = "book-meta";

    const ratingStars = document.createElement("span");
    ratingStars.className = "book-rating";
    const stars = "★★★★★";
    const filledCount = Math.round(book.rating);
    ratingStars.textContent = stars
      .split("")
      .map((s, i) => (i < filledCount ? "★" : "☆"))
      .join("");

    const ratingBadge = document.createElement("span");
    ratingBadge.className = "book-rating-badge";
    ratingBadge.textContent = book.rating.toFixed(1);

    meta.appendChild(ratingStars);
    meta.appendChild(ratingBadge);

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const indexLabel = document.createElement("span");
    indexLabel.className = "book-index";
    indexLabel.textContent = `#${index + 1}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "book-delete";
    deleteBtn.innerHTML = "✕ Remove";

    deleteBtn.addEventListener("click", () => {
      const idx = books.indexOf(book);
      if (idx !== -1) {
        books.splice(idx, 1);
        renderBooks();
      }
    });

    actions.appendChild(indexLabel);
    actions.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(actions);

    col.appendChild(card);
    bookList.appendChild(col);
  });
}

// ---------- Add book ----------

function handleAdd() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const price = Number(priceInput.value);
  const rating = Number(ratingInput.value);

  if (!title || !author || !price || !rating) {
    alert("Please fill all fields with valid values.");
    return;
  }

  if (price < 0 || rating < 1 || rating > 5) {
    alert("Price must be positive and rating between 1 and 5.");
    return;
  }

  books.push({ title, author, price, rating });

  titleInput.value = "";
  authorInput.value = "";
  priceInput.value = "";
  ratingInput.value = "";

  renderBooks();
  titleInput.focus();
}

addBtn.addEventListener("click", handleAdd);

[ratingInput, priceInput].forEach(input => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleAdd();
    }
  });
});

// ---------- Search & sort ----------

searchInput.addEventListener("input", renderBooks);
sortSelect.addEventListener("change", renderBooks);

// ---------- Theme toggle with localStorage ----------

const THEME_KEY = "bookstore-theme";

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  let theme = stored;

  if (!theme) {
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }

  applyTheme(theme);
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});

// ---------- Init ----------

initTheme();
renderBooks();