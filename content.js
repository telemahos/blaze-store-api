console.log("content.js loaded");

function fetchProducts(type) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "fetchProducts", type: type }, response => {
            if (response.status === "Fetching products" && response.products) {
                console.log("Products fetched:", response.products);
                resolve(response.products);  // Resolve with the fetched products
            } else {
                console.error("Failed to fetch products:", response.error);
                reject(response.error);
            }
        });
    });
}

function displayProducts(products) {
    setTimeout(() => {  // Delay to ensure DOM elements are loaded
        const priceElements = document.querySelectorAll('#tbodyid .card-block h5');

        if (priceElements.length === 0) {
            console.warn("No price elements found. Aborting product display.");
            return;
        }

        priceElements.forEach(priceElement => {
            let greetingSpan = priceElement.querySelector('span.greeting');

            if (!greetingSpan) {
                greetingSpan = document.createElement('span');
                greetingSpan.style.fontWeight = 'normal';
                greetingSpan.style.marginLeft = '10px';
                greetingSpan.className = 'greeting';
                priceElement.appendChild(greetingSpan);
                console.log("Greeting span created and added to DOM.");
            }

            const cardBlock = priceElement.closest('.card-block');
            if (cardBlock) {
                const linkElement = cardBlock.querySelector('a[href*="prod.html?idp_="]');
                if (linkElement) {
                    const hrefValue = linkElement.getAttribute('href');
                    const urlParams = new URLSearchParams(hrefValue.split('?')[1]);
                    const productId = urlParams.get('idp_');

                    if (productId) {
                        const product = products.find(p => p.id == productId);
                        if (product) {
                            greetingSpan.textContent = "ID: " + product.title;
                            console.log(`Product found and displayed: ${product.id} - ${product.title}`);
                        } else {
                            console.log(`Product not found for ID: ${productId}`);
                            greetingSpan.textContent = "ID: Not found";
                        }
                    } else {
                        console.warn("No product ID found in link element.");
                    }
                } else {
                    console.warn("No link element found in card block.");
                }
            } else {
                console.warn("No card block found for price element.");
            }
        });
    }, 500);  // Adjust delay as necessary
}

// Fetch initial products and then display them
fetchProducts("entries").then(products => {
    displayProducts(products);
});

// Add an event listener to the pagination button
document.addEventListener("DOMContentLoaded", () => {
    const paginationButton = document.querySelector('#searchButton');
    if (paginationButton) {
        paginationButton.addEventListener('click', () => {
            console.log('Pagination button clicked, fetching new products...');
            fetchProducts("pagination").then(products => {
                displayProducts(products);
            });
        });
    }
});

// Listen for URL changes to detect pagination
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('URL changed, fetching new products');
        fetchProducts("pagination").then(products => {
            displayProducts(products);
        });
    }
}).observe(document, { subtree: true, childList: true });
