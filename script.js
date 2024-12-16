document.addEventListener('DOMContentLoaded', function() {

function pretrazi() {
    const datumUnos = document.getElementById('datum').value.trim();
    const kanal = document.getElementById('kanal').value.trim().toLowerCase();
    const pojam = document.getElementById('pojam').value.trim().toLowerCase();

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

            let trenutniDatum = ''; // Praćenje trenutnog datuma

            Object.keys(rasporedi).forEach(singleDatum => {
                if (datum === '' || singleDatum.includes(datum)) {
                    const kanali = rasporedi[singleDatum];

                    if (trenutniDatum !== singleDatum && trenutniDatum !== '') {
                        // Dodajte horizontalnu liniju za novi datum
                        rezultati.push('<hr>');
                    }

                    trenutniDatum = singleDatum;

                    Object.keys(kanali).forEach(singleKanal => {
                        kanali[singleKanal].forEach(emisija => {
                            if ((pojam === '' || emisija.emisija.toLowerCase().includes(pojam)) &&
                                (kanal === '' || singleKanal.toLowerCase().includes(kanal))) {
                                rezultati.push(
                                    `<div><strong>${singleDatum} - ${singleKanal}</strong>: <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                                );
                            }
                        });
                    });
                }
            });

            const rezultatiDiv = document.getElementById('rezultati');
            rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
        })
        .catch(error => console.error('Greška pri učitavanju JSON-a:', error));
}


    window.pretrazi = pretrazi;
});
