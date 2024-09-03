console.log("Blaze Store Background Script Loaded");

async function fetchProducts() {
    const url = `https://api.demoblaze.com/entries`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Netzwerkfehler');
        
        const newData = await response.json();
        console.log("New data", newData);

        // Alte Daten abrufen
        chrome.storage.local.get('products', function(result) {
            let allProducts = [];

            if (result.products) {
                // Wenn es bereits gespeicherte Produkte gibt, diese mit den neuen kombinieren
                allProducts = result.products.Items.concat(newData.Items);
            } else {
                // Falls keine alten Produkte vorhanden sind, nutze nur die neuen
                allProducts = newData.Items;
            }

            // Speichere die kombinierten Daten
            chrome.storage.local.set({ products: { Items: allProducts } }, function() {
                console.log('Produkte kombiniert und gespeichert');
            });
        });

    } catch (error) {
        console.error('Fehler:', error);
    }
}

// Rufe fetchProducts auf, wenn ein Tab aktualisiert wird
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        fetchProducts();
    }
});

// Rufe fetchProducts auf, wenn ein neuer Tab aktiviert wird
chrome.tabs.onActivated.addListener((activeInfo) => {
    fetchProducts();
});

// Initialer Aufruf beim Laden des Hintergrundskripts
fetchProducts();
