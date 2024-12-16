document.addEventListener('DOMContentLoaded', function() {

    function pretrazi() {
    const datumUnos = document.getElementById('datum').value.trim(); // Vrijednost: YYYY-MM-DD
    const kanal = document.getElementById('kanal').value.trim().toLowerCase();
    const pojam = document.getElementById('pojam').value.trim().toLowerCase();

    let datum = '';
    if (datumUnos) {
        const [godina, mjesec, dan] = datumUnos.split('-'); // Razdvoji vrijednost iz inputa
        datum = `${dan}.${mjesec}.${godina}`; // Konvertiraj u DD.MM.YYYY format
    }

    console.log("Traženi datum:", datum); // Za provjeru u konzoli

    fetch('tv_raspored.json')
        .then(response => response.json())
        .then(data => {
            let rezultati = [];
            const rasporedi = data.rasporedi;

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
                rezultati.push('Nema rezultata za uneseni datum.');
            }

            const rezultatiDiv = document.getElementById('rezultati');
            rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
        })
        .catch(error => console.error('Greška pri učitavanju JSON-a:', error));
}

    window.pretrazi = pretrazi;
});
