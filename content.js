console.log("content.js geladen");

const observer = new MutationObserver((mutations) => {
    const priceElements = document.querySelectorAll('#tbodyid .card-block h5');

    priceElements.forEach(priceElement => {
        let greetingSpan = priceElement.querySelector('span.greeting');

        // Falls kein span.greeting existiert, erstelle ein neues
        if (!greetingSpan) {
            greetingSpan = document.createElement('span');
            greetingSpan.style.fontWeight = 'normal';
            greetingSpan.style.marginLeft = '10px';
            greetingSpan.className = 'greeting';
            priceElement.appendChild(greetingSpan);
        }

        const cardBlock = priceElement.closest('.card-block');
        if (cardBlock) {
            const linkElement = cardBlock.querySelector('a[href*="prod.html?idp_="]');
            if (linkElement) {
                const hrefValue = linkElement.getAttribute('href');
                const urlParams = new URLSearchParams(hrefValue.split('?')[1]);
                const productId = urlParams.get('idp_');

                if (productId) {
                    loadProducts(productId, (product) => {
                        if (product) {
                            greetingSpan.textContent = "ID: " + product.title; // Aktualisiere den Textinhalt
                        }
                    });
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

function loadProducts(itemNr, callback) {
    chrome.storage.local.get('products', function(result) {
        if (result.products) {
            const product = result.products.Items.find(item => item.id == itemNr);

            if (product) {
                console.log("Produkt: ", product);
                callback(product);
            } else {
                console.log('Produkt nicht gefunden für itemNr:', itemNr);
                callback(null);
            }
        } else {
            console.log('Keine Produkte gefunden');
            callback(null);
        }
    });
}
