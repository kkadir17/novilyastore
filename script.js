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

const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesOverlay = document.getElementById("favoritesOverlay");
const closeFavorites = document.getElementById("closeFavorites");
const favoriteItems = document.getElementById("favoriteItems");

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

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        const productName =
            product
                .querySelector("h3")
                .textContent
                .toLowerCase();

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

        const productCard =
            button.closest(".product-card");

        const name =
            productCard
                .querySelector("h3")
                .textContent
                .trim();

        const priceText =
            productCard
                .querySelector(".product-bottom strong")
                .textContent
                .trim();

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

            const cartItem =
                document.createElement("div");

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
                    type="button"
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
   SEPETTEN ÜRÜN SİL
========================= */

cartItems.addEventListener("click", event => {

    const removeButton =
        event.target.closest(".remove-cart");

    if (!removeButton) {
        return;
    }

    const index =
        Number(removeButton.dataset.index);

    cart.splice(index, 1);

    updateCart();

});


/* =========================
   SEPET ADEDİ
========================= */

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalQuantity;

}


/* =========================
   SEPET TOPLAMI
========================= */

function updateCartTotal() {

    const total =
        cart.reduce(
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

/*
   Favoriler localStorage'da tutuluyor.
   Böylece sayfa yenilense bile silinmiyor.
*/

let favorites = [];

try {

    favorites =
        JSON.parse(
            localStorage.getItem("novilyaFavorites") || "[]"
        );

    if (!Array.isArray(favorites)) {
        favorites = [];
    }

} catch (error) {

    favorites = [];

}


/* =========================
   FAVORİLERİ KAYDET
========================= */

function saveFavorites() {

    localStorage.setItem(
        "novilyaFavorites",
        JSON.stringify(favorites)
    );

}


/* =========================
   FAVORİ BUTONLARINI GÜNCELLE
========================= */

function updateFavoriteButtons() {

    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            const name =
                card
                    .querySelector("h3")
                    .textContent
                    .trim();

            const button =
                card.querySelector(".favorite-btn");

            if (!button) {
                return;
            }

            const isFavorite =
                favorites.some(
                    item => item.name === name
                );

            if (isFavorite) {

                button.classList.add(
                    "favorite-active"
                );

                button.textContent = "♥";

            } else {

                button.classList.remove(
                    "favorite-active"
                );

                button.textContent = "♡";

            }

        });

}


/* =========================
   ÜRÜNÜ FAVORİYE EKLE / ÇIKAR
========================= */

document
    .querySelectorAll(".favorite-btn")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const card =
                button.closest(".product-card");

            if (!card) {
                return;
            }

            const name =
                card
                    .querySelector("h3")
                    .textContent
                    .trim();

            const price =
                card
                    .querySelector(".product-bottom strong")
                    .textContent
                    .trim();

            const existingIndex =
                favorites.findIndex(
                    item => item.name === name
                );


            if (existingIndex !== -1) {

                /* FAVORİDEN ÇIKAR */

                favorites.splice(
                    existingIndex,
                    1
                );

            } else {

                /* FAVORİYE EKLE */

                favorites.push({
                    name: name,
                    price: price
                });

            }


            saveFavorites();

            updateFavoriteButtons();

            renderFavorites();

        });

    });


/* =========================
   FAVORİ PANELİNİ AÇ
========================= */

function openFavorites() {

    renderFavorites();

    favoritesPanel.classList.add("active");

    favoritesOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================
   FAVORİ PANELİNİ KAPAT
========================= */

function closeFavoritesPanel() {

    favoritesPanel.classList.remove("active");

    favoritesOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================
   ÜST FAVORİ BUTONU
========================= */

favoritesBtn.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openFavorites();

    }
);


/* =========================
   FAVORİ KAPATMA
========================= */

closeFavorites.addEventListener(
    "click",
    closeFavoritesPanel
);


favoritesOverlay.addEventListener(
    "click",
    closeFavoritesPanel
);


/* =========================
   FAVORİLERİ PANELDE GÖSTER
========================= */

function renderFavorites() {

    favoriteItems.innerHTML = "";


    if (favorites.length === 0) {

        favoriteItems.innerHTML = `
            <p class="empty-favorites">
                Henüz favori ürününüz yok.
            </p>
        `;

        return;

    }


    favorites.forEach((item, index) => {

        const favoriteItem =
            document.createElement("div");

        favoriteItem.className =
            "favorite-item";

        favoriteItem.innerHTML = `
            <div class="favorite-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ${item.price}
                </span>

            </div>

            <button
                class="remove-favorite"
                data-index="${index}"
                type="button"
                aria-label="${item.name} favorilerden çıkar"
            >
                ×
            </button>
        `;

        favoriteItems.appendChild(
            favoriteItem
        );

    });

}


/* =========================
   FAVORİDEN SİL
========================= */

favoriteItems.addEventListener(
    "click",
    event => {

        const removeButton =
            event.target.closest(
                ".remove-favorite"
            );

        if (!removeButton) {
            return;
        }

        const index =
            Number(
                removeButton.dataset.index
            );

        favorites.splice(index, 1);

        saveFavorites();

        updateFavoriteButtons();

        renderFavorites();

    }
);


/* =========================
   ESC TUŞU
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCartPanel();

            closeFavoritesPanel();

        }

    }
);


/* =========================
   BAŞLANGIÇ
========================= */

updateCart();

updateFavoriteButtons();

renderFavorites();
