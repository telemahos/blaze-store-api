console.log("Blaze Store Background Script Loaded");

async function fetchProducts() {
    const url = `https://api.demoblaze.com/entries`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Netzwerkfehler');
        
        const data = await response.json();
        console.log("data", data);

        // Speichere die Daten mit chrome.storage
        chrome.storage.local.set({ products: data }, function() {
            console.log('Produkte gespeichert');
        });
    } catch (error) {
        console.error('Fehler:', error);
    }
}

fetchProducts();



// function loadProducts() {
//     chrome.storage.local.get('products', function(result) {
//         if (result.products) {
//             console.log(result.products.Items); // Hier stehen die abgerufenen Zitate
//         } else {
//             console.log('Keine Zitate gefunden');
//         }
//     });
// }

// Beispielaufruf, um die Zitate zu laden
// loadProducts();


// async function fetchQuotes() {
//     const url = `https://api.demoblaze.com/entries`;
    
//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Netzwerkfehler');
      
//       const data = await response.json();
//       console.log(data); // Hier kannst du die Daten speichern oder weiterverarbeiten
//     } catch (error) {
//       console.error('Fehler:', error);
//     }
//   }

//   fetchQuotes();