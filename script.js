document.addEventListener('DOMContentLoaded', function() {

function pretrazi() {
    const datumUnos = document.getElementById('datum').value.trim(); // Format: DD-MM-YYYY
    const kanal = document.getElementById('kanal').value.trim().toLowerCase();
    const pojam = document.getElementById('pojam').value.trim().toLowerCase();

    // Konvertiraj datum iz DD-MM-YYYY u DD.MM.YYYY
    let datum = '';
    if (datumUnos) {
        const [dan, mjesec, godina] = datumUnos.split('-');
        datum = `${dan}.${mjesec}.${godina}`;
    }

    fetch('tv_raspored.json')
        .then(response => response.json())
        .then(data => {
            let rezultati = [];
            const rasporedi = data.rasporedi;

            // Ako datum nije prazan, tražimo samo za taj datum
            if (datum && rasporedi[datum]) {
                const kanali = rasporedi[datum];
                Object.keys(kanali).forEach(singleKanal => {
                    kanali[singleKanal].forEach(emisija => {
                        if ((pojam === '' || emisija.emisija.toLowerCase().includes(pojam)) &&
                            (kanal === '' || singleKanal.toLowerCase().includes(kanal))) {
                            rezultati.push(
                                `<div><strong>${datum} - ${singleKanal}</strong>: <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                            );
                        }
                    });
                });
            } else {
                // Prolazimo kroz sve datume ako datum nije unesen ili nije pronađen
                Object.keys(rasporedi).forEach(singleDatum => {
                    if (datum === '' || singleDatum.includes(datum)) {
                        const kanali = rasporedi[singleDatum];
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
            }

            const rezultatiDiv = document.getElementById('rezultati');
            rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
        })
        .catch(error => console.error('Greška pri učitavanju JSON-a:', error));
}

    window.pretrazi = pretrazi;
});
