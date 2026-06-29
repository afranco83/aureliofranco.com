import { defineTranslations } from './defineTranslations.ts';

export const es = defineTranslations({
  hero: {
    title: 'Aurelio Franco',
    description: 'De la idea a la interfaz',
  },
  aboutMe: {
    text: [
      '<p>A lo largo de mi trayectoria profesional he trabajado en <strong >frontend, producto, UI/UX, SEO y gestión de proyectos</strong >, desarrollando una visión transversal que me permite entender los productos como sistemas completos y no solo como desarrollos técnicos.</p>',
      '<p>Esta combinación me permite moverme con naturalidad entre la visión de negocio y la ejecución, participando tanto en la definición de la estrategia como en la construcción de soluciones digitales útiles, escalables y sostenibles.</p>',
      '<p>Actualmente combino <strong >desarrollo frontend moderno e inteligencia artificial</strong > para acelerar procesos, optimizar la toma de decisiones y aumentar la capacidad de entrega de equipos y proyectos.</p>',
      '<p>Me motiva transformar ideas complejas en productos digitales claros, eficientes y centrados en las personas.</p>',
    ],
    featuredClaim: {
      text: '"Llevo más de 20 años construyendo productos digitales, conectando <strong>estrategia, experiencia de usuario y tecnología</strong>.',
    },
  },
});
