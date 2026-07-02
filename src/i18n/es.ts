import { defineTranslations } from './defineTranslations.ts';

export const es = defineTranslations({
  meta: {
    title: 'Aurelio Franco · Frontend Developer & Product Leader',
    description:
      'Frontend developer con más de 20 años de experiencia en producto, UX y tecnología. Especialista en React, TypeScript e IA aplicada.',
  },
  nav: {
    menuLabel: 'Menú de navegación',
    items: [
      { href: '#hero', label: 'Inicio' },
      { href: '#about', label: 'Sobre mí' },
      { href: '#how-to', label: 'Cómo trabajo' },
      { href: '#stack', label: 'Tecnologías' },
      { href: '#social', label: 'Contacto' },
    ],
  },
  hero: {
    title: 'Aurelio Franco',
    subtitle: 'De la idea a la interfaz',
  },
  aboutMe: {
    title: 'Sobre mí',
    description:
      'Frontend Engineering impulsado por IA, visión de producto y liderazgo de proyectos',
    text: [
      '<p>A lo largo de mi trayectoria profesional he trabajado en <strong>frontend, producto, UI/UX, SEO y gestión de proyectos</strong>, desarrollando una visión transversal que me permite entender los productos como sistemas completos y no solo como desarrollos técnicos.</p>',
      '<p>Esta combinación me permite moverme con naturalidad entre la visión de negocio y la ejecución, participando tanto en la definición de la estrategia como en la construcción de soluciones digitales útiles, escalables y sostenibles.</p>',
      '<p>Actualmente combino <strong>desarrollo frontend moderno e inteligencia artificial</strong> para acelerar procesos, optimizar la toma de decisiones y aumentar la capacidad de entrega de equipos y proyectos.</p>',
      '<p>Me motiva transformar ideas complejas en productos digitales claros, eficientes y centrados en las personas.</p>',
    ],
  },
  featuredClaim: {
    text: 'Llevo más de 20 años construyendo productos digitales, conectando <strong>estrategia, experiencia de usuario y tecnología</strong>.',
  },
  claim: {
    text: 'Construyo <strong>experiencias digitales</strong> modernas a través de ingeniería <strong>frontend</strong>, visión de <strong>producto</strong> y ejecución asistida por <strong>IA</strong>.',
  },
  howTo: {
    title: 'Cómo trabajo',
    description: 'Lo que aporto a cada proyecto',
    items: [
      {
        icon: 'Glass',
        title: 'Visión estratégica',
        description:
          '<p>Analizo el contexto, identifico oportunidades y <strong>alineo tecnología, producto y negocio</strong> para avanzar con una dirección clara.</p>',
      },
      {
        icon: 'Chemistry',
        title: 'Mentalidad de producto',
        description:
          '<p>Tomo decisiones pensando en el <strong>valor generado para usuarios, equipos y organizaciones</strong>, más allá de la implementación técnica.</p>',
      },
      {
        icon: 'LeaderDuotone',
        title: 'Liderazgo transversal',
        description:
          '<p>Facilito la <strong>colaboración entre negocio, producto, diseño y desarrollo</strong> para convertir ideas en resultados.</p>',
      },
      {
        icon: 'LaptopDuotone',
        title: 'Excelencia técnica',
        description:
          '<p>Diseño y desarrollo <strong>soluciones frontend modernas, mantenibles</strong> y preparadas para evolucionar.</p>',
      },
      {
        icon: 'Ai',
        title: 'IA aplicada',
        description:
          '<p>Integro <strong>inteligencia artificial</strong> en los procesos de investigación, desarrollo y toma de decisiones para aumentar la eficiencia y la capacidad de entrega.</p>',
      },
      {
        icon: 'ChartLight',
        title: 'Orientación a resultados',
        description:
          '<p>Priorizo el impacto, la simplicidad y la <strong>entrega de valor</strong> por encima de la complejidad innecesaria.</p>',
      },
    ],
  },
  stack: {
    title: 'Tecnologías y enfoque',
    description:
      'Mi trabajo se apoya en una combinación de tecnologías modernas, pensamiento de producto e inteligencia artificial aplicada para transformar ideas en productos digitales escalables y sostenibles.',
    items: [
      {
        icon: 'Code',
        title: 'Frontend',
        description:
          '<p>React, Next.js, TypeScript y tecnologías web modernas para construir interfaces rápidas, escalables y mantenibles.</p><p><strong>Stack</strong>: React · Next.js · TypeScript · JavaScript · HTML · CSS</p>',
      },
      {
        icon: 'Lamp',
        title: 'Producto y UI/UX',
        description:
          '<p>Discovery, experiencia de usuario, accesibilidad y analítica para diseñar productos alineados con las necesidades reales de usuarios y negocio.</p><p><strong>Áreas</strong>: Product Discovery · UX Thinking · Design Systems · Accesibilidad · SEO · Analítica</p>',
      },
      {
        icon: 'Structure',
        title: 'Desarrollo',
        description:
          '<p>Arquitectura frontend, testing, rendimiento y automatización para garantizar calidad, escalabilidad y sostenibilidad a largo plazo.</p><p><strong>Capacidades</strong>: Git · CI/CD · Testing · Optimización de rendimiento · Arquitectura Frontend</p>',
      },
      {
        icon: 'AIBox',
        title: 'Inteligencia Artificial',
        description:
          '<p>Herramientas y flujos de trabajo potenciados por IA que ayudan a acelerar la investigación, el desarrollo, la documentación y la toma de decisiones.</p><p><strong>Toolkit</strong>: ChatGPT · Claude · Cursor · GitHub Copilot · AI-Assisted Workflows</p>',
      },
    ],
  },
  social: {
    label: 'Contacto',
    title: 'En contacto',
    description: 'Un espacio abierto a compartir ideas, resolver dudas o simplemente saludar.',
    email: {
      label: 'Escríbeme',
      href: 'mailto:info@aureliofranco.com',
    },
    items: [
      {
        title: 'WhatsApp',
        icon: 'Whatsapp',
        href: 'https://wa.me/34661468441',
      },
      {
        title: 'LinkedIn',
        icon: 'Linkedin',
        href: 'https://www.linkedin.com/in/aureliofranco',
      },
      {
        title: 'GitHub',
        icon: 'Github',
        href: 'https://github.com/afranco83',
      },
    ],
    madeWith: 'Hecho con',
    madeBy: 'por Aurelio Franco',
  },
});
