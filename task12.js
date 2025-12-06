
        const books = [
            { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 299, genre: "Self-Help" },
            { id: 2, title: "Atomic Habits", author: "James Clear", price: 499, genre: "Productivity" },
            { id: 3, title: "Ikigai", author: "Héctor García", price: 350, genre: "Philosophy" },
            { id: 4, title: "Psychology of Money", author: "Morgan Housel", price: 400, genre: "Finance" },
            { id: 5, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 250, genre: "Finance" },
            { id: 6, title: "Sapiens", author: "Yuval Noah Harari", price: 599, genre: "History" },
            { id: 7, title: "1984", author: "George Orwell", price: 399, genre: "Dystopian" },
            { id: 8, title: "To Kill a Mockingbird", author: "Harper Lee", price: 450, genre: "Classic" },
            { id: 9, title: "Pride and Prejudice", author: "Jane Austen", price: 299, genre: "Romance" },
            { id: 10, title: "The Little Prince", author: "Antoine de Saint-Exupéry", price: 199, genre: "Fantasy" },
            { id: 11, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", price: 599, genre: "Fantasy" },
            { id: 12, title: "The Lord of the Rings", author: "J.R.R. Tolkien", price: 999, genre: "Epic Fantasy" },
            { id: 13, title: "Dune", author: "Frank Herbert", price: 699, genre: "Sci-Fi" },
            { id: 14, title: "The Godfather", author: "Mario Puzo", price: 499, genre: "Crime" },
            { id: 15, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", price: 550, genre: "Magical Realism" },
            { id: 16, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 350, genre: "Classic" },
            { id: 17, title: "Brave New World", author: "Aldous Huxley", price: 399, genre: "Dystopian" }
        ];

        let cart = [];

        function createBookCard(book) {
            const inCart = cart.some(item => item.id === book.id);
            return `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <div class="card book-card h-100" role="article">
                        <div class="book-cover position-relative">
                            <span class="genre-badge">${book.genre}</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="author mb-4"><i class="fas fa-feather-alt me-2"></i>${book.author}</p>
                            <div class="mt-auto">
                                <p class="price">₹${book.price.toLocaleString()}</p>
                                <button
                                    class="btn add-to-cart-btn w-100"
                                    ${inCart ? "disabled" : ""}
                                    data-id="${book.id}">
                                    ${inCart ? '<i class="fas fa-check me-2"></i>In Cart ✓' : '<i class="fas fa-cart-plus me-2"></i>Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function displayBooks() {
            const container = document.getElementById('bookList');
            container.innerHTML = books.map(b => createBookCard(b)).join('');
            attachAddToCartListeners();
            updateCartButton();
        }

        function attachAddToCartListeners() {
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'), 10);
                    addToCart(id);
                });
            });
        }

        function addToCart(bookId) {
            const book = books.find(b => b.id === bookId);
            const item = cart.find(i => i.id === bookId);
            if (!item && book) {
                cart.push({ ...book, quantity: 1 });
            }
            updateCart();
        }

        function removeFromCart(bookId) {
            cart = cart.filter(item => item.id !== bookId);
            updateCart();
        }

        function updateCart() {
            updateCartItems();
            updateCartButton();
            displayBooks();
        }

        function updateCartItems() {
            const cartItemsDiv = document.getElementById('cartItems');
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            if (cart.length === 0) {
                cartItemsDiv.innerHTML = `
                    <p class="text-center text-muted py-4 mb-0">
                        <i class="fas fa-shopping-cart fa-2x mb-3 d-block opacity-50"></i>
                        Your cart is empty 😢
                    </p>
                `;
                document.getElementById('checkoutBtn').disabled = true;
                document.getElementById('cartSummary').children[1].textContent = '₹0';
                return;
            }

            document.getElementById('checkoutBtn').disabled = false;

            cartItemsDiv.innerHTML = cart.map(item => `
                <div class="cart-item" role="listitem">
                    <div class="d-flex justify-content-between align-items-center">
                        <div style="flex: 1;">
                            <div class="fw-bold fs-6 mb-1">${item.title}</div>
                            <small class="text-muted">by ${item.author} • Qty: ${item.quantity}</small>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <span class="h6 fw-bold text-primary mb-0">
                                ₹${(item.price * item.quantity).toLocaleString()}
                            </span>
                            <button class="cart-remove-btn" aria-label="Remove ${item.title}" data-id="${item.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.cart-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'), 10);
                    removeFromCart(id);
                });
            });

            document.getElementById('cartSummary').children[1].textContent =
                `₹${totalPrice.toLocaleString()}`;
        }

        function updateCartButton() {
            const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
            const cartBtn = document.getElementById('showCartBtn');
            cartBtn.innerHTML = `<i class="fas fa-shopping-cart me-2"></i>Cart (${cartCount})`;
            cartBtn.style.background = cartCount > 0 ? 'var(--gradient-warning)' : 'var(--gradient-secondary)';
        }

        document.getElementById('showCartBtn').addEventListener('click', () => {
            document.getElementById('cartPanel').classList.toggle('show');
        });

        document.getElementById('clearCartBtn').addEventListener('click', () => {
            if (confirm('Clear entire cart? This cannot be undone!')) {
                cart = [];
                updateCart();
            }
        });

        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (cart.length === 0) return;
            const totalItems = cart.reduce((a, i) => a + i.quantity, 0);
            const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);
            alert(
                `Thank you for your purchase!\n\n` +
                `Items: ${totalItems}\n` +
                `Total: ₹${total.toLocaleString()}\n\n` +
                `Order placed successfully!`
            );
            cart = [];
            updateCart();
            document.getElementById('cartPanel').classList.remove('show');
        });

        document.addEventListener('DOMContentLoaded', () => {
            displayBooks();
            updateCart();
        });
    