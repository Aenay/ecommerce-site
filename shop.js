// Fetch and display JSON data
document.addEventListener("DOMContentLoaded", () => {
    // Reusable function to display products by category
    function displayCategory(category, containerId) {
        const container = document.getElementById(containerId);

        // Fetch the JSON file
        fetch("data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then(data => {
                // Filter the data based on the selected category
                const filteredData = data.filter(product => product.category === category);

                // Clear the container before appending new content
                container.innerHTML = "";

                // Iterate through the filtered data and display it
                if (filteredData.length > 0) {
                    filteredData.forEach(product => {
                        const productDiv = document.createElement("div");
                        productDiv.classList.add("product", "text-center", "col-lg-3", "col-md-4", "col-12");

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

                        container.appendChild(productDiv);
                    });
                } else {
                    container.innerHTML = `<p>No products found in the "${category}" category.</p>`;
                }
            })
            .catch(error => {
                console.error("Error:", error);
                container.innerHTML = "<p>Failed to load data</p>";
            });
    }

    // Display products in specific categories
    displayCategory("shoes", "shop-container");

    // Cart functionality
    const cartContent = document.querySelector(".cart-content");

    // Add to Cart functionality
    document.addEventListener("click", event => {
        if (event.target.classList.contains("add-cart")) {
            const productBox = event.target.closest(".product");
            addToCart(productBox);
        }
    });

    const addToCart = product => {
        const productImg = product.querySelector("img").src;
        const productTitle = product.querySelector(".p-name").textContent;
        const productPrice = product.querySelector(".p-price").textContent;

        // Check if the item is already in the cart
        const existingItem = Array.from(cartContent.children).find(cartItem =>
            cartItem.querySelector(".cart-product-title").textContent === productTitle
        );

        if (existingItem) {
            // Increment quantity if item already in cart
            const quantityElement = existingItem.querySelector(".cart-number");
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
        } else {
            // Create a new cart item
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-box");

            cartItem.innerHTML = `
                <img src="${productImg}" class="cart-img">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button class="decrement">-</button>
                        <span class="cart-number">1</span>
                        <button class="increment">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash cart-remove"></i>
            `;

            // Add the new cart item to the cart
            cartContent.appendChild(cartItem);
        }

        updateTotal();
    };

    // Update total price
    const updateTotal = () => {
        const cartItems = document.querySelectorAll(".cart-box");
        let total = 0;

        cartItems.forEach(cartItem => {
            const price = parseFloat(cartItem.querySelector(".cart-price").textContent.replace("$", ""));
            const quantity = parseInt(cartItem.querySelector(".cart-number").textContent);
            total += price * quantity;
        });

        document.querySelector(".total-cart-price").textContent = `$${total.toFixed(2)}`;
    };

    // Handle increment, decrement, and remove functionality
    document.addEventListener("click", event => {
        if (event.target.classList.contains("increment")) {
            const quantityElement = event.target.previousElementSibling;
            quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
            updateTotal();
        } else if (event.target.classList.contains("decrement")) {
            const quantityElement = event.target.nextElementSibling;
            const newQuantity = parseInt(quantityElement.textContent) - 1;
            if (newQuantity > 0) {
                quantityElement.textContent = newQuantity;
            } else {
                event.target.closest(".cart-box").remove();
            }
            updateTotal();
        } else if (event.target.classList.contains("cart-remove")) {
            event.target.closest(".cart-box").remove();
            updateTotal();
        }
    });

    // Open and close cart
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");

    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));
});