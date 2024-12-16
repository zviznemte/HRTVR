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

            Object.keys(rasporedi).forEach(singleDatum => {
                let datumRezultati = []; // Privremeni rezultati za jedan datum
                if (datum === '' || singleDatum.includes(datum)) {
                    const kanali = rasporedi[singleDatum];
                    Object.keys(kanali).forEach(singleKanal => {
                        if (kanal === '' || singleKanal.toLowerCase().includes(kanal)) {
                            kanali[singleKanal].forEach(emisija => {
                                if (pojam === '' || emisija.emisija.toLowerCase().includes(pojam)) {
                                    datumRezultati.push(
                                        `<div><strong>${singleDatum} - ${singleKanal}</strong>: <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                                    );
                                }
                            });
                        }
                    });

                    // Ako ima rezultata za trenutni datum, dodajte ih
                    if (datumRezultati.length > 0) {
                        rezultati.push(`<h3>${singleDatum}</h3>`);
                        rezultati = rezultati.concat(datumRezultati);
                    }
                }
            });

            const rezultatiDiv = document.getElementById('rezultati');
            rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
        })
        .catch(error => console.error('Greška pri učitavanju JSON-a:', error));
}
