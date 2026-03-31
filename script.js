const servicios=document.querySelectorAll(".service-card");

function animateCards(saliente, entrante, direction) {
    const collapseAnim = direction === 'left' ? 'collapseLeft' : 'collapseRight';
    const expandAnim = direction === 'left' ? 'expandFromRight' : 'expandFromLeft';
    const duration_salida  = '0.7s', duration_entrada = '1s';

    saliente.style.animation = `${collapseAnim} ease ${duration_salida} forwards`;

    saliente.addEventListener('animationend', () => {
        saliente.style.display    = 'none';
        saliente.style.animation  = '';

        entrante.style.display = '';
        entrante.style.animation = `${expandAnim} ease ${duration_entrada} forwards`;
    }, { once: true });

    entrante.addEventListener('animationend', () => {
        entrante.style.animation = '';
    }, { once: true });
}

function nextService(){
    let pos=0, pos_serv_active;

    // Solo encontrar cuál está visible
    servicios.forEach(servicio => {
        if (servicio.style.display === '') {
            pos_serv_active = pos;
        }
        pos++;
    });

    const saliente = servicios[pos_serv_active];
    const entrante = servicios[pos_serv_active + 1] ?? servicios[0];

    // Dejar que animateCards maneje todo
    animateCards(saliente, entrante, 'left');
}

function backService() {
    let pos = 0, pos_serv_active;

    // Solo encontrar cuál está visible
    servicios.forEach(servicio => {
        if (servicio.style.display === '') {
            pos_serv_active = pos;
        }
        pos++;
    });

    const saliente = servicios[pos_serv_active];
    const entrante = servicios[pos_serv_active - 1] ?? servicios[pos - 1];

    // Dejar que animateCards maneje todo
    animateCards(saliente, entrante, 'rigth');
}