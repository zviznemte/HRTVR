document.addEventListener('DOMContentLoaded', function() {
    // Funkcija za generiranje checkboxova
    function generirajCheckboxove() {
        fetch('tv_raspored.json')
            .then(response => response.json())
            .then(data => {
                const rasporedi = data.rasporedi; // Podaci iz JSON-a
                const kanalListaDiv = document.getElementById('kanal-lista');

                const sviKanali = new Set();
                // Prolazak kroz sve datume i kanale
                Object.values(rasporedi).forEach(dan => {
                    Object.keys(dan).forEach(kanal => sviKanali.add(kanal));
                });

                // Generiranje checkboxova
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
            .catch(error => console.error('Greška pri dohvaćanju JSON-a:', error));
    }

    // Funkcija za pretraživanje
    function pretrazi() {
        const datumUnos = document.getElementById('datum').value.trim();
        const pojam = document.getElementById('pojam').value.trim().toLowerCase();

        // Dohvati sve označene kanale
        const odabraniKanali = Array.from(document.querySelectorAll('input[name="kanal"]:checked'))
                                   .map(checkbox => checkbox.value);

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

                // Prolazak kroz sve datume
                Object.keys(rasporedi).forEach(singleDatum => {
                    if (datum === '' || singleDatum === datum) {
                        const kanali = rasporedi[singleDatum];

                        Object.keys(kanali).forEach(singleKanal => {
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
            .catch(error => console.error('Greška pri dohvaćanju podataka:', error));
    }

    // Poziv funkcija
    generirajCheckboxove();
    window.pretrazi = pretrazi;
});
