document.getElementById('searchButton').addEventListener('click', searchProduct);

function searchProduct() {
    const searchInput = document.getElementById('searchInput').value;
    console.log("Suche: ", searchInput);
    loadProducts(searchInput);
}

function loadProducts(itemNr) {
    let product = "";
    chrome.storage.local.get('products', function(result) {
        if (result.products) {
            // Angenommen, itemNr ist eine Zahl (Index)
            const itemIndex = parseInt(itemNr, 10);
            product = result.products.Items[itemIndex];
            document.getElementById('productContainer').innerHTML = "Name: " + product.title + " <br> " + "ID: " + product.id + " <br>" + "Preis: " + product.price + "€ <br>" + "Beschreibung: " + product.desc;
            console.log("Produkt: ", product) // Hier stehen die abgerufenen Produkte
        } else {
            console.log('Keine Produkte gefunden');
        }
    });
    return product;
}