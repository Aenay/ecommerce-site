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
                            <button class="buy-btn">Buy Now</button>
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


    displayCategory("shoes", "shoes-container");
    displayCategory("watches", "watches-container");
    displayCategory("Clothing", "clothing-container");
});