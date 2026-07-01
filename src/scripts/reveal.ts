import type { Easing } from 'motion';
import { animate, inView } from 'motion';

type InViewOptions = Parameters<typeof inView>[2];

type RevealVariant =
  | 'fade-scale'
  | 'iris'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-top'
  | 'wipe-bottom';

type RevealStyle = {
  opacity?: string;
  transform?: string;
  clipPath?: string;
};

type RevealConfig = {
  from: RevealStyle;
  to: RevealStyle;
  duration: number;
  ease: Easing;
};

// Curva ease-in-out suave (arranca y termina despacio, sin tirón inicial).
// Un 'easeOut' plano empieza a máxima velocidad desde el primer frame, lo
// que se percibe como un movimiento brusco/acelerado.
const EASE_SMOOTH: Easing = [0.83, 0, 0.17, 1];

// Efecto ya validado (el que gustó en FeaturedClaim): fade + scale sutil.
// Un delta grande en un elemento del tamaño del viewport desplaza demasiado
// los bordes y se percibe como un salto, por eso se mantiene tan sutil.
function scaleVariant(fromScale: number, duration: number): RevealConfig {
  return {
    from: { opacity: '0', transform: `scale(${fromScale})` },
    to: { opacity: '1', transform: 'scale(1)' },
    duration,
    ease: EASE_SMOOTH,
  };
}

// Cortinas al estilo motion.dev/examples?category=page-transitions: el propio
// fondo de la sección barre para revelar el contenido, sin mover ni escalar nada
// (por eso no tiene el salto de las transiciones basadas en transform).
const WIPE_INSET_FROM: Record<'left' | 'right' | 'top' | 'bottom', string> = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
};

function wipeVariant(
  direction: keyof typeof WIPE_INSET_FROM,
  duration: number,
): RevealConfig {
  return {
    from: { clipPath: WIPE_INSET_FROM[direction] },
    to: { clipPath: 'inset(0% 0% 0% 0%)' },
    duration,
    ease: EASE_SMOOTH,
  };
}

// circle(100%) cubre siempre las esquinas de la caja (la base porcentual de
// clip-path circle() es la diagonal), así que nunca deja contenido recortado.
function irisVariant(duration: number): RevealConfig {
  return {
    from: { clipPath: 'circle(0% at 50% 50%)' },
    to: { clipPath: 'circle(100% at 50% 50%)' },
    duration,
    ease: EASE_SMOOTH,
  };
}

const VARIANTS: Record<RevealVariant, RevealConfig> = {
  'fade-scale': scaleVariant(0.94, 0.9),
  iris: irisVariant(1.1),
  'wipe-left': wipeVariant('left', 0.9),
  'wipe-right': wipeVariant('right', 0.9),
  'wipe-top': wipeVariant('top', 0.9),
  'wipe-bottom': wipeVariant('bottom', 0.9),
};

function isRevealVariant(value: string): value is RevealVariant {
  return value in VARIANTS;
}

// amount es un ratio sobre el ÁREA TOTAL del elemento, no válido aquí: Howto
// y Stack son más altos que un viewport, así que ese % nunca se alcanza y el
// disparador no salta jamás (por eso desaparecían). amount: 0 solo mira si
// hay algo de solape, y el margen negativo controla cuánto hay que scrollear
// antes de que cuente como "en pantalla" — así funciona sin importar el alto
// real de la sección.
const TRIGGER_OPTIONS: InViewOptions = {
  amount: 0,
  margin: '0px 0px -30% 0px',
};

// Puertas dobles: dos paneles opacos (mismo color que el fondo de la sección)
// cubren el contenido y se deslizan hacia los lados para revelarlo. A diferencia
// del resto de variantes, el contenido real nunca se toca — solo se posicionan
// y mueven los paneles decorativos, así que sin JS el contenido siempre está
// visible y los paneles (sin position/tamaño estático) no ocupan espacio.
function revealDoors(section: HTMLElement): void {
  const panels = Array.from(
    section.querySelectorAll<HTMLElement>('[data-reveal-door]'),
  );
  if (panels.length === 0) return;

  for (const panel of panels) {
    const side = panel.dataset.revealDoor;
    Object.assign(panel.style, {
      position: 'absolute',
      top: '0',
      bottom: '0',
      width: '50%',
      left: side === 'left' ? '0' : '',
      right: side === 'right' ? '0' : '',
    });
  }

  const stopObserving = inView(
    section,
    () => {
      for (const panel of panels) {
        const side = panel.dataset.revealDoor;
        animate(
          panel,
          {
            transform:
              side === 'left' ? 'translateX(-100%)' : 'translateX(100%)',
          },
          { duration: 1, ease: EASE_SMOOTH },
        );
      }
      stopObserving();
    },
    TRIGGER_OPTIONS,
  );
}

function revealSection(section: HTMLElement, config: RevealConfig): void {
  // Estado inicial aplicado solo en runtime: si este script no llega a ejecutarse,
  // el contenido servido por Astro permanece 100% visible (nunca se oculta vía CSS estático).
  Object.assign(section.style, config.from);

  const stopObserving = inView(
    section,
    () => {
      animate(section, config.to, {
        duration: config.duration,
        ease: config.ease,
      });
      stopObserving();
    },
    TRIGGER_OPTIONS,
  );
}

function init(): void {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (prefersReducedMotion) return;

  const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');

  for (const section of sections) {
    const variant = section.dataset.reveal;
    if (variant === 'doors') {
      revealDoors(section);
      continue;
    }
    if (!variant || !isRevealVariant(variant)) continue;
    revealSection(section, VARIANTS[variant]);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
