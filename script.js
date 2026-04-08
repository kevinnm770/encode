const esDesktop = () => window.innerWidth >= 1000;
const servicios=document.querySelectorAll(".service-card");
const main = document.querySelector('main');
const secciones = document.querySelectorAll('main section');
const footer = document.querySelector('footer');
const titulo_principal = document.querySelector("#titulo");
const nav_inferior = document.querySelector("#nav_inferior");
const navInicioBoxes = Array.from(document.querySelectorAll('#inicio .box_type_slim'));
let seccionActual;
const dots = document.querySelectorAll('.services-pagination a');
const navInicioMap = {
  inicio: 'inicio',
  acercade: 'acercade',
  servicios: 'servicios',
  proyectos: 'proyectos',
  contacto: 'contacto',
  faq: 'ayuda'
};

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

function activarNavInicio(seccionId) {
  navInicioBoxes.forEach((box) => {
    const targetId = navInicioMap[normalizarTexto(box.innerText)];
    box.classList.toggle('active', targetId === seccionId);
  });
}

function irASeccion(seccionId) {
  const seccion = document.getElementById(seccionId);

  if (!seccion) {
    return;
  }

  if (esDesktop()) {
    main.scrollTo({
      left: seccion.offsetLeft,
      behavior: 'smooth'
    });
    return;
  }

  seccion.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

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
  if(esDesktop()){
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
          activarNavInicio('inicio');

          footer.style.transform = "translateY(100%)";
          break;
      case 'servicios':
          cambiarTitulo('Servicios');
          toggleNavInferior(true);
          activarDot('servicios');
          activarNavInicio('servicios');

          footer.style.transform = "translateY(100%)";
          break;
      case 'contacto':
          cambiarTitulo('Contacto');
          toggleNavInferior(true);
          activarDot('contacto');
          activarNavInicio('contacto');

          footer.style.transform = "translateY(100%)";
          break;
      case 'acercade':
          cambiarTitulo('Acerca de');
          toggleNavInferior(true);
          activarDot('acercade');
          activarNavInicio('acercade');

          footer.style.transform = "translateY(100%)";
          break;
      case 'proyectos':
          cambiarTitulo('Proyectos');
          toggleNavInferior(true);
          activarDot('proyectos');
          activarNavInicio('proyectos');

          footer.style.transform = "translateY(100%)";
          break;
      case 'ayuda':
          cambiarTitulo('Ayuda');
          toggleNavInferior(true);
          activarDot('ayuda');
          activarNavInicio('ayuda');

          footer.style.transform = "translateY(100%)";
          break;
      case 'section_footer':
          cambiarTitulo('');
          toggleNavInferior(false);
          activarDot('section_footer');
          activarNavInicio('');

          footer.style.transform = "translateY(0%)";
          break;
      default:
          cambiarTitulo('');
    }
  }

}, { threshold: 0.5 });

secciones.forEach(s => observer.observe(s));

window.addEventListener('wheel', (e) => {
  if (!esDesktop()) return; // ← sale sin hacer nada

  e.preventDefault();
  main.scrollBy({
    left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth,
    behavior: 'smooth'
  });

}, { passive: false });

document.querySelectorAll('.services-pagination a').forEach(dot => {
  if (!esDesktop()) return; // ← sale sin hacer nada

  dot.addEventListener('click', (e) => {
    e.preventDefault(); // ← detiene el scroll nativo
    
    const seccionId = dot.getAttribute('aria-label');
    irASeccion(seccionId);
  });
});

navInicioBoxes.forEach((box) => {
  const seccionId = navInicioMap[normalizarTexto(box.innerText)];

  if (!seccionId) {
    return;
  }

  box.setAttribute('role', 'button');
  box.setAttribute('tabindex', '0');

  box.addEventListener('click', () => {
    activarNavInicio(seccionId);
    irASeccion(seccionId);
  });

  box.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activarNavInicio(seccionId);
      irASeccion(seccionId);
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
  if (!esDesktop()) return; // ← sale sin hacer nada
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
  if (!esDesktop()) return; // ← sale sin hacer nada
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

const acercaOpciones = [
  {
    descripcion:
      'Encode es un estudio que integra <strong>diseño, programación y estrategia</strong> desde el inicio para construir plataformas coherentes y escalables.',
    proceso: 'IDEA → DISEÑO → CÓDIGO → SISTEMA → EVOLUCIÓN'
  },
  {
    descripcion:
      'Trabajamos cada proyecto como un sistema: primero entendemos el objetivo, luego diseñamos una experiencia clara y finalmente desarrollamos una solución lista para crecer.',
    proceso: 'DESCUBRIR → PROPONER → DISEÑAR → DESARROLLAR → LANZAR'
  },
  {
    descripcion:
      'Porque unimos diseño y código en un mismo proceso, evitando piezas sueltas y creando plataformas con dirección visual, rendimiento y mantenimiento desde el primer día.',
    proceso: 'CLARIDAD → COHERENCIA → ESCALABILIDAD → ACOMPAÑAMIENTO'
  }
];

const columnaAcerca = document.querySelector('#acercade .columna-izquierda');
const descripcionAcerca = document.querySelector('#acercade .texto-descripcion');
const procesoAcerca = document.querySelector('#acercade .texto-proceso');
const preguntasAcerca = document.querySelectorAll('#acercade .columna-derecha .pregunta');
let acercaActiva = 0;
let acercaAnimando = false;

function actualizarAcerca(index) {
  if (
    acercaAnimando ||
    index === acercaActiva ||
    !acercaOpciones[index] ||
    !columnaAcerca ||
    !descripcionAcerca ||
    !procesoAcerca
  ) {
    return;
  }

  acercaAnimando = true;
  columnaAcerca.classList.remove('acerca-entrando', 'acerca-saliendo');
  void columnaAcerca.offsetWidth;
  columnaAcerca.classList.add('acerca-saliendo');

  columnaAcerca.addEventListener('animationend', () => {
    descripcionAcerca.innerHTML = acercaOpciones[index].descripcion;
    procesoAcerca.textContent = acercaOpciones[index].proceso;

    preguntasAcerca.forEach((pregunta, preguntaIndex) => {
      pregunta.classList.toggle('is-active', preguntaIndex === index);
    });

    acercaActiva = index;
    columnaAcerca.classList.remove('acerca-saliendo');
    columnaAcerca.classList.add('acerca-entrando');

    columnaAcerca.addEventListener('animationend', () => {
      columnaAcerca.classList.remove('acerca-entrando');
      acercaAnimando = false;
    }, { once: true });
  }, { once: true });
}

preguntasAcerca.forEach((pregunta, index) => {
  pregunta.setAttribute('role', 'button');
  pregunta.setAttribute('tabindex', '0');
  pregunta.classList.toggle('is-active', index === acercaActiva);

  pregunta.addEventListener('click', () => actualizarAcerca(index));
  pregunta.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      actualizarAcerca(index);
    }
  });
});

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
