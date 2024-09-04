console.log("Blaze Store Background Script Loaded");

let allProducts = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background:", request);
    if (request.action === "getProduct") {
        const product = allProducts.find(p => p.id == request.productId);
        console.log("Product found:", product);
        sendResponse({ product: product });
    } else if (request.action === "fetchProducts") {
        fetchAndStoreProducts(request.type).then(products => {
            sendResponse({ status: "Fetching products", products: products });
        }).catch(error => {
            console.error("Error fetching products:", error);
            sendResponse({ status: "Failed", error: error.message });
        });
    }
    return true;  // Keeps the message channel open for asynchronous response
});

async function fetchAndStoreProducts(type = "entries") {
    const url = type === "pagination"
        ? "https://api.demoblaze.com/pagination"
        : "https://api.demoblaze.com/entries";

    console.log(`Attempting to fetch data from ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);

        const newData = await response.json();
        console.log(`Fetched data from ${type} API:`, JSON.stringify(newData));

        if (!newData.Items || !Array.isArray(newData.Items)) {
            throw new Error(`Invalid data structure from ${type} API`);
        }

        newData.Items.forEach(newItem => {
            const existingItemIndex = allProducts.findIndex(item => item.id === newItem.id);
            if (existingItemIndex !== -1) {
                allProducts[existingItemIndex] = newItem;
            } else {
                allProducts.push(newItem);
            }
        });

        console.log(`Total products stored: ${allProducts.length}`);
        console.log('Product IDs:', allProducts.map(item => item.id).join(', '));

        return newData.Items;  // Return the newly fetched products

    } catch (error) {
        console.error('Error while fetching/storing products:', error);
        throw error;
    }
}

// Initial fetch
fetchAndStoreProducts();

// Fetch every 5 minutes
setInterval(() => {
    console.log("Performing periodic fetch of products...");
    fetchAndStoreProducts();
}, 5 * 60 * 1000);
