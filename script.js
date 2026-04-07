const servicios=document.querySelectorAll(".service-card");
const main = document.querySelector('main');
const secciones = document.querySelectorAll('main section');
const titulo_principal = document.querySelector("#titulo");
const nav_inferior = document.querySelector("#nav_inferior");
let seccionActual;
const dots = document.querySelectorAll('.services-pagination a');

function activarDot(seccionId) {
  dots.forEach(dot => {
    dot.classList.remove('is-active');
    if (dot.getAttribute('aria-label') === seccionId) {
      dot.classList.add('is-active');
    }
  });
}

function cambiarTitulo(nuevoTexto) {
  if (titulo_principal.innerText === nuevoTexto) return;

  // Cancela cualquier animación en curso
  titulo_principal.classList.remove('titulo-saliendo', 'titulo-entrando');

  // Fuerza reflow para que el browser registre el reset
  void titulo_principal.offsetWidth;

  titulo_principal.classList.add('titulo-saliendo');

  titulo_principal.addEventListener('animationend', () => {
    titulo_principal.innerText = nuevoTexto;
    titulo_principal.classList.remove('titulo-saliendo');
    titulo_principal.classList.add('titulo-entrando');

    titulo_principal.addEventListener('animationend', () => {
      titulo_principal.classList.remove('titulo-entrando');
    }, { once: true });

  }, { once: true });
}

function toggleNavInferior(visible) {
  nav_inferior.classList.remove('nav-entrando', 'nav-saliendo');
  void nav_inferior.offsetWidth; // fuerza reflow

  if (visible && nav_inferior.style.display === "none") {
    nav_inferior.style.display = "";
    nav_inferior.classList.add('nav-entrando');
  } else if(!visible && nav_inferior.style.display === ""){
    nav_inferior.classList.add('nav-saliendo');

    nav_inferior.addEventListener('animationend', () => {
      nav_inferior.style.display = "none";
      nav_inferior.classList.remove('nav-saliendo');
    }, { once: true });
  }
}

const observer = new IntersectionObserver((entries) => {
  // Si hay múltiples, quedarse con la que tiene mayor intersección
  const entry = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!entry) return;

  seccionActual = entry.target;

  switch (seccionActual.id) {
    case 'inicio':
        cambiarTitulo('');
        toggleNavInferior(false);
        activarDot('inicio');
        break;
    case 'servicios':
        cambiarTitulo('Servicios');
        toggleNavInferior(true);
        activarDot('servicios');
        break;
    case 'acercade':
        cambiarTitulo('Acerca de');
        toggleNavInferior(true);
        activarDot('acercade');
        break;
    case 'ayuda':
        cambiarTitulo('Ayuda');
        toggleNavInferior(true);
        activarDot('ayuda');
        break;
    default:
        cambiarTitulo('');
  }

}, { threshold: 0.5 });

secciones.forEach(s => observer.observe(s));

window.addEventListener('wheel', (e) => {
  if (window.innerWidth < 768) return; // ← sale sin hacer nada

  e.preventDefault();
  main.scrollBy({
    left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth,
    behavior: 'smooth'
  });

}, { passive: false });

document.querySelectorAll('.services-pagination a').forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.preventDefault(); // ← detiene el scroll nativo
    
    const seccionId = dot.getAttribute('aria-label');
    const seccion = document.getElementById(seccionId);
    
    if (seccion) {
      main.scrollTo({
        left: seccion.offsetLeft,
        behavior: 'smooth'
      });
    }
  });
});

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

let intervalo = setInterval(nextService, 10000);
const showcase = document.querySelector('.service-showcase');

showcase.addEventListener('mouseenter', () => {
    clearInterval(intervalo); // pausa al entrar
});

showcase.addEventListener('mouseleave', () => {
    intervalo = setInterval(nextService, 10000);
});

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

document.addEventListener('click', (e) => {
    const navLateral = document.querySelector('#navLateral');

    if (!navLateral.contains(e.target) && navLateral.style.display !== "none") {
        navLateral.style.animation = "disappear ease-in .5s";
        const content = navLateral.innerHTML;
        navLateral.innerHTML="";

        navLateral.addEventListener('animationend', () => {
            navLateral.style.animation = "";
            navLateral.style.display = "none";
            navLateral.innerHTML=content;
        }, { once: true });
    }
});

document.querySelector("#btn_collapse").addEventListener('click', (e) => {
    e.stopPropagation();
    const navLateral = document.querySelector('#navLateral');
    const content = navLateral.innerHTML;
    navLateral.innerHTML="";

    navLateral.style.display = "";
    navLateral.style.animation = "appear ease-out .5s";

    navLateral.addEventListener('animationend', () => {
        navLateral.style.animation = "";
        navLateral.innerHTML=content;
    }, { once: true });
});