console.log("content.js geladen");

// Stelle sicher, dass das Skript erst geladen wird, wenn die Seite vollständig geladen ist
const observer = new MutationObserver((mutations) => {
    // Suche nach allen Preis-Elementen
    const priceElements = document.querySelectorAll('#tbodyid .card-block h5');  // Passe den Selektor an, falls nötig
    console.log("Gefundene Preis-Elemente: ", priceElements);

    priceElements.forEach(priceElement => {
        // Überprüfe, ob das Element bereits das greetingSpan hat, um Duplikate zu vermeiden
        if (!priceElement.querySelector('span.greeting')) {
            let product = loadProducts(2);
            console.log("The Produkt: ", product);
            // Erstelle das greetingSpan Element
            const greetingSpan = document.createElement('span');
            greetingSpan.textContent = 'Hallo, wie geht’s? ' + product[0];
            greetingSpan.style.fontWeight = 'normal';
            greetingSpan.style.marginLeft = '10px';
            greetingSpan.className = 'greeting'; // Klasse hinzufügen, um später Duplikate zu vermeiden

            // Füge es dem Preis-Element hinzu
            priceElement.appendChild(greetingSpan);
        }
    });
});
    
// Beobachte den gesamten Body auf Änderungen
observer.observe(document.body, { childList: true, subtree: true });
    
function loadProducts(itemNr) {
    let product = "";
    chrome.storage.local.get('products', function(result) {
        if (result.products) {
            // Angenommen, itemNr ist eine Zahl (Index)
            const itemIndex = parseInt(itemNr, 10);
            product = result.products.Items[itemIndex];
            document.getElementById('productContainer').innerHTML = "Name: " + product.title + " <br> " + "ID: " + product.id + " <br>" + "Preis: " + product.price + "€ <br>" + "Beschreibung: " + product.desc;
            console.log("2 Produkt: ", product) // Hier stehen die abgerufenen Produkte
        } else {
            console.log('Keine Produkte gefunden');
        }
    });
    return product;
}