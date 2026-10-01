const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

/* =========================
   ARAMA
========================= */

searchBtn.addEventListener("click", () => {
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        searchInput.focus();
    }
});

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const productName =
            product.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchValue)) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
});


/* =========================
   SEPETİ AÇ / KAPAT
========================= */

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCartPanel() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);


/* =========================
   SEPETE ÜRÜN EKLE
========================= */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        const name = productCard.querySelector("h3").textContent;

        const priceText =
            productCard.querySelector(".product-bottom strong").textContent;

        const price =
            parseInt(priceText.replace(/\D/g, ""));

        const existingProduct =
            cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        openCart();
    });

});


/* =========================
   SEPETİ GÜNCELLE
========================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Sepetiniz şu anda boş.
            </p>
        `;

    } else {

        cart.forEach((item, index) => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <p>${item.quantity} × ${item.price} TL</p>
                </div>

                <button
                    class="remove-cart"
                    data-index="${index}"
                    aria-label="${item.name} ürününü kaldır"
                >
                    ×
                </button>
            `;

            cartItems.appendChild(cartItem);
        });

    }

    updateCartCount();
    updateCartTotal();
}


/* =========================
   ÜRÜN SİL
========================= */

cartItems.addEventListener("click", (event) => {

    if (event.target.classList.contains("remove-cart")) {

        const index =
            Number(event.target.dataset.index);

        cart.splice(index, 1);

        updateCart();
    }

});


/* =========================
   SEPET ADEDİ
========================= */

function updateCartCount() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
}


/* =========================
   SEPET TOPLAMI
========================= */

function updateCartTotal() {

    const total = cart.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );

    cartTotal.textContent =
        `${total.toLocaleString("tr-TR")} TL`;
}


/* =========================
   FAVORİLER
========================= */

document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("favorite-active");

        if (button.classList.contains("favorite-active")) {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }

    });

});


/* =========================
   ESC TUŞU
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeCartPanel();
    }

});


/* =========================
   BAŞLANGIÇ
========================= */

updateCart();
