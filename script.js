document.addEventListener('DOMContentLoaded', function() {
    // Dinamičko generiranje checkboxova za kanale
    function generirajCheckboxove() {
        fetch('tv_raspored.json')
            .then(response => response.json())
            .then(data => {
                const rasporedi = data.rasporedi;
                const kanalListaDiv = document.getElementById('kanal-lista');

                // Skup svih kanala iz JSON-a
                const sviKanali = new Set();
                Object.values(rasporedi).forEach(kanali => {
                    Object.keys(kanali).forEach(kanal => sviKanali.add(kanal));
                });

                // Generiraj checkboxove
                sviKanali.forEach(kanal => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = kanal;
                    checkbox.name = 'kanal';
                    
                    const label = document.createElement('label');
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${kanal}`));
                    
                    kanalListaDiv.appendChild(label);
                });
            })
            .catch(error => console.error('Greška pri učitavanju kanala:', error));
    }

    // Funkcija za pretragu
    function pretrazi() {
        const datumUnos = document.getElementById('datum').value.trim(); // Format: YYYY-MM-DD
        const pojam = document.getElementById('pojam').value.trim().toLowerCase();

        // Dohvati odabrane kanale
        const odabraniKanali = Array.from(document.querySelectorAll('input[name="kanal"]:checked'))
                                   .map(checkbox => checkbox.value);

        // Konvertiraj datum u DD.MM.YYYY
        let datum = '';
        if (datumUnos) {
            const [godina, mjesec, dan] = datumUnos.split('-');
            datum = `${dan}.${mjesec}.${godina}`;
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
                            // Provjeri je li kanal među odabranima
                            if (odabraniKanali.length === 0 || odabraniKanali.includes(singleKanal)) {
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
            .catch(error => console.error('Greška pri učitavanju JSON-a:', error));
    }

    // Generiraj checkboxove prilikom učitavanja stranice
    generirajCheckboxove();
    window.pretrazi = pretrazi;
});
