document.addEventListener('DOMContentLoaded', function() {
    // Funkcija za popunjavanje padajućeg izbornika s kanalima
    function pretrazi() {
    const datumUnos = document.getElementById('datum').value.trim();
    const kanal = document.getElementById('kanal').value.trim();
    const pojam = document.getElementById('pojam').value.trim().toLowerCase();

    // Konvertiraj datum u "1. 1. 2000."
    let datum = '';
    if (datumUnos) {
        const [godina, mjesec, dan] = datumUnos.split('-');
        datum = `${parseInt(dan)}. ${parseInt(mjesec)}. ${godina}.`;
    }

    console.log("Traženi datum:", datum); // Provjera u konzoli

    fetch('tv_raspored.json') // Ovdje provjerite ime datoteke
        .then(response => response.json())
        .then(data => {
            console.log("Učitani podaci iz JSON-a:", data); // Provjera JSON podataka

            let rezultati = [];
            const rasporedi = data.rasporedi;

            Object.keys(rasporedi).forEach(singleDatum => {
                if (datum === '' || singleDatum === datum) {
                    const kanali = rasporedi[singleDatum];

                    Object.keys(kanali).forEach(singleKanal => {
                        if (kanal === '' || singleKanal === kanal) {
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

            console.log("Pronađeni rezultati:", rezultati); // Provjera rezultata prije ispisa
            const rezultatiDiv = document.getElementById('rezultati');
            rezultatiDiv.innerHTML = rezultati.length > 0 ? rezultati.join('') : 'Nema rezultata.';
        })
        .catch(error => {
            console.error('Greška pri dohvaćanju podataka:', error);
            alert('Greška pri dohvaćanju podataka. Provjerite putanju do JSON datoteke.');
        });
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
