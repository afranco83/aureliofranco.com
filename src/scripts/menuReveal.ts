import { animate } from 'motion';

const details = document.querySelector<HTMLDetailsElement>('.nav-details');
const links = Array.from(
  details?.querySelectorAll<HTMLElement>('[data-nav-scope="mobile"]') ?? [],
);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (details && links.length && !prefersReducedMotion) {
  const staggerStep = 0.05;
  const revealOptions = { duration: 0.5, ease: 'easeInOut' } as const;

  details.addEventListener('toggle', () => {
    if (!details.open) return;

    links.forEach((link, index) => {
      animate(
        link,
        { opacity: [0, 1], x: [-16, 0] },
        { ...revealOptions, delay: index * staggerStep },
      );
    });
  });
}
