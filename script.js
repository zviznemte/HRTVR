function pretrazi() {
    const datumUnos = document.getElementById('datum').value.trim(); // Format: YYYY-MM-DD
    const kanal = document.getElementById('kanal').value.trim().toLowerCase();
    const pojam = document.getElementById('pojam').value.trim().toLowerCase();

    // Konvertiraj datum iz YYYY-MM-DD u DD.MM.YYYY
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
                if (datum === '' || singleDatum.includes(datum)) {
                    const kanali = rasporedi[singleDatum];

                    Object.keys(kanali).forEach(singleKanal => {
                        if (kanal === '' || singleKanal.toLowerCase().includes(kanal)) {
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
