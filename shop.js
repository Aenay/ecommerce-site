document.addEventListener("DOMContentLoaded", () => {
    const cartContent = document.querySelector(".cart-content");
    const totalCartPrice = document.querySelector(".total-cart-price");
    const cartItemCount = document.querySelector(".cart-item-count");
    const shopContainer = document.getElementById("shop-container"); // Container for displaying all products

    // Show/hide cart
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");

    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    // Load cart from localStorage and render it
    renderCart();

    // Display all products
    function displayAllProducts() {
        fetch("data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then(data => {
                shopContainer.innerHTML = "";

                if (data.length > 0) {
                    data.forEach(product => {
                        const productDiv = document.createElement("div");
                        productDiv.classList.add("product", "text-center", "col-lg-3", "col-md-4", "col-12");

                        // Store product ID in a data attribute for background use
                        productDiv.dataset.productId = product.id;

                        productDiv.innerHTML = `
                            <img class="img-fluid mb-3" src="${product.img}" alt="">
                            <div class="star">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <h5 class="p-name">${product.name}</h5>
                            <h4 class="p-price">$${product.price}</h4>
                            <button class="buy-btn add-cart">Add to Cart</button>
                        `;

                        shopContainer.appendChild(productDiv);
                    });

                    const products = document.querySelectorAll(".product");
                    products.forEach(product => {
                        const addCartButton = product.querySelector(".add-cart");
                        addCartButton.addEventListener("click", () => addToCart(product));
                    });
                } else {
                    shopContainer.innerHTML = "<p>No products found.</p>";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                shopContainer.innerHTML = "<p>Failed to load data</p>";
            });
    }

    // Add to cart function
    function addToCart(product) {
        const productId = product.dataset.productId; // Retrieve the product ID from the data attribute
        const productImg = product.querySelector("img").src;
        const productTitle = product.querySelector(".p-name").textContent;
        const productPrice = product.querySelector(".p-price").textContent;

        const cartItem = {
            id: productId,
            img: productImg,
            name: productTitle,
            price: parseFloat(productPrice.replace("$", "")),
            quantity: 1
        };

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity++;
        } else {
            cartItems.push(cartItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        renderCart();

        // Show success alert
        Swal.fire({
            title: `${productTitle} has been successfully added to your cart!`,
            icon: "success",
            draggable: true
        });

    }

    // Render the cart from localStorage
    function renderCart() {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartContent.innerHTML = "";
        let total = 0;

        cartItems.forEach(item => {
            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");
            cartBox.innerHTML = `
                <img src="${item.img}" class="cart-img">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${item.name}</h2>
                    <span class="cart-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-quantity">
                        <button class="decrement">-</button>
                        <span class="cart-number">${item.quantity}</span>
                        <button class="increment">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash cart-remove"></i>
            `;

            cartBox.querySelector(".increment").addEventListener("click", () => {
                item.quantity++;
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                renderCart();
            });

            cartBox.querySelector(".decrement").addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cartItems.splice(cartItems.indexOf(item), 1);
                }
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                renderCart();
            });

            cartBox.querySelector(".cart-remove").addEventListener("click", () => {
                cartItems.splice(cartItems.indexOf(item), 1);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                renderCart();
            });

            cartContent.appendChild(cartBox);
            total += item.price * item.quantity;
        });

        totalCartPrice.textContent = `$${total.toFixed(2)}`;
        cartItemCount.textContent = cartItems.length;
    }

    // Clear cart function
    function clearCart() {
        localStorage.removeItem("cartItems");
        renderCart();
    }

    // Show thank you popup
    function showThankYouPopup() {
        Swal.fire({
            title: "Thank you for your purchase!",
            icon: "success",
            draggable: true
        });
    }

    // PayPal integration
    paypal.Buttons({
        createOrder: function(data, actions) {
            const total = parseFloat(totalCartPrice.textContent.replace("$", ""));
            return actions.order.create({
                purchase_units: [{
                    amount: { value: total.toFixed(2) }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                showThankYouPopup();
                clearCart();
            });
        },
        onError: function(err) {
            console.error("PayPal Checkout Error:", err);
            alert("An error occurred during the payment process.");
        }
    }).render("#paypal-button-container");

    // Display all products on page load
    displayAllProducts();
});