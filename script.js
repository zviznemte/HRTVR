document.addEventListener('DOMContentLoaded', function() {

  function pretrazi() {
      const datum = document.getElementById('datum').value.trim();
      const kanal = document.getElementById('kanal').value.trim();
      const pojam = document.getElementById('pojam').value.trim().toLowerCase();
        fetch('tv_raspored.json')
        .then(response => response.json())
        .then(data => {
          let rezultati = [];
            const rasporedi = data.rasporedi;
            if(rasporedi[datum]){
              const kanali = rasporedi[datum];
                if(kanali[kanal]){
                  kanali[kanal].forEach(emisija => {
                   if (emisija.emisija.toLowerCase().includes(pojam)) {
                      rezultati.push(
                        `<div><strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                      );
                     }
                    });
                }else{
                    Object.keys(kanali).forEach(singleKanal => {
                      kanali[singleKanal].forEach(emisija =>{
                          if(singleKanal.toLowerCase().includes(kanal) && emisija.emisija.toLowerCase().includes(pojam)) {
                                rezultati.push(`<div><strong>${singleKanal}</strong> - <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`);
                            }else if(emisija.emisija.toLowerCase().includes(pojam) && kanal === '') {
                                rezultati.push(`<div><strong>${singleKanal}</strong> - <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`);
                              }
                         });
                    });
                }
            }else{
                Object.keys(rasporedi).forEach(singleDatum =>{
                  if(singleDatum.toLowerCase().includes(datum)){
                     const kanali = rasporedi[singleDatum];
                      if(kanali[kanal]){
                           kanali[kanal].forEach(emisija => {
                             if (emisija.emisija.toLowerCase().includes(pojam)) {
                                rezultati.push(
                                 `<div><strong>${singleDatum} - ${singleKanal}</strong> - <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`
                                );
                               }
                           });
                       }else{
                         Object.keys(kanali).forEach(singleKanal => {
                             kanali[singleKanal].forEach(emisija =>{
                                 if(singleKanal.toLowerCase().includes(kanal) && emisija.emisija.toLowerCase().includes(pojam)) {
                                     rezultati.push(`<div><strong>${singleDatum} - ${singleKanal}</strong> - <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`);
                                 }else if(emisija.emisija.toLowerCase().includes(pojam) && kanal === '') {
                                    rezultati.push(`<div><strong>${singleDatum} - ${singleKanal}</strong> - <strong>${emisija.vrijeme}</strong> - ${emisija.emisija}</div>`);
                                 }
                             });
                         });
                      }
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