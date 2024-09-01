console.log("content.js geladen");

// Stelle sicher, dass das Skript erst geladen wird, wenn die Seite vollständig geladen ist
// document.addEventListener("DOMContentLoaded", () => {
     
// window.addEventListener('load', () => {
// const init = () => {
    const observer = new MutationObserver((mutations) => {
        // Suche nach allen Preis-Elementen
        const priceElements = document.querySelectorAll('#tbodyid .card-block h5');  // Passe den Selektor an, falls nötig
        console.log("Gefundene Preis-Elemente: ", priceElements);
    
        priceElements.forEach(priceElement => {
            // Überprüfe, ob das Element bereits das greetingSpan hat, um Duplikate zu vermeiden
            if (!priceElement.querySelector('span.greeting')) {
                // Erstelle das greetingSpan Element
                const greetingSpan = document.createElement('span');
                greetingSpan.textContent = 'Hallo, wie geht’s?';
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
    
