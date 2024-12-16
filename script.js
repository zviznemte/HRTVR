document.addEventListener('DOMContentLoaded', function() {
    // Funkcija za popunjavanje padajućeg izbornika s kanalima
    function popuniIzbornikKanala() {
        fetch('tv_raspored.json')
            .then(response => response.json())
            .then(data => {
                const rasporedi = data.rasporedi;
                const kanalSelect = document.getElementById('kanal');

                const sviKanali = new Set();
                // Dohvati sve jedinstvene kanale iz JSON-a
                Object.values(rasporedi).forEach(dan => {
                    Object.keys(dan).forEach(kanal => sviKanali.add(kanal));
                });

                // Popuni <select> element s kanalima
                sviKanali.forEach(kanal => {
                    const option = document.createElement('option');
                    option.value = kanal;
                    option.textContent = kanal;
                    kanalSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Greška pri dohvaćanju JSON-a:', error));
    }

    // Funkcija za pretraživanje
    function pretrazi() {
        const datumUnos = document.getElementById('datum').value.trim();
        const kanal = document.getElementById('kanal').value.trim(); // Dohvati odabrani kanal
        const pojam = document.getElementById('pojam').value.trim().toLowerCase();

        // Konvertiraj datum iz YYYY-MM-DD u DD.MM.YYYY.
        let datum = '';
        if (datumUnos) {
            const [godina, mjesec, dan] = datumUnos.split('-');
            datum = `${dan}.${mjesec}.${godina}.`;
        }

        fetch('tv_raspored.json')
            .then(response => response.json())
            .then(data => {
                let rezultati = [];
                const rasporedi = data.rasporedi;

                Object.keys(rasporedi).forEach(singleDatum => {
                    if (datum === '' || singleDatum === datum) {
                        const kanali = rasporedi[singleDatum];

                        Object.keys(kanali).forEach(singleKanal => {
                            if (kanal === '' || singleKanal === kanal) { // Filtriraj po kanalu
                                kanali[singleKanal].forEach(emisija => {
                                    if (pojam === '' || emisija.emisija.toLowerCase().includes(pojam)) {
                                        rezultati.push(
                                            `<div><strong>${singleDatum} - ${singleKanal}</strong>: <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                                        );
                                    }
                                });
                            }
                        });
                    }
                });

                const rezultatiDiv = document.getElementById('rezultati');
                rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
            })
            .catch(error => console.error('Greška pri dohvaćanju podataka:', error));
    }

    // Poziv funkcija prilikom učitavanja stranice
    popuniIzbornikKanala();
    window.pretrazi = pretrazi;
});
