/**
 * Clases Tailwind compartidas para el sistema de scroll-reveal.
 *
 * Se centralizan aquí en vez de en global.css para no añadir CSS global
 * pudiendo expresarse con utilidades de Tailwind (variantes arbitrarias
 * sobre `html.js-reveal` y `data-[visible=true]`, más `motion-reduce`).
 * El atributo `data-reveal`/`data-curtain-reveal` sigue siendo necesario
 * como selector para reveal.ts/curtains.ts; estas clases solo aportan el
 * aspecto visual.
 */
export const REVEAL_CLASSES =
  'transition-[opacity,transform] duration-1000 ease-out ' +
  '[html.js-reveal_&]:opacity-0 [html.js-reveal_&]:translate-y-6 ' +
  '[html.js-reveal_&]:data-[visible=true]:opacity-100 [html.js-reveal_&]:data-[visible=true]:translate-y-0 ' +
  'motion-reduce:transition-none motion-reduce:[html.js-reveal_&]:opacity-100 motion-reduce:[html.js-reveal_&]:translate-y-0';

export const CURTAIN_PANEL_CLASSES =
  'hidden [html.js-reveal_&]:block [html.js-reveal_&]:opacity-0 motion-reduce:[html.js-reveal_&]:hidden';
