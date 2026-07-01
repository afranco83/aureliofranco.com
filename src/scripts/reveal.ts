import { inView } from 'motion';

const REVEAL_SELECTOR = '[data-reveal]';
const VISIBLE_ATTR = 'data-visible';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  inView(
    REVEAL_SELECTOR,
    (element) => {
      element.setAttribute(VISIBLE_ATTR, 'true');
    },
    { margin: '0px 0px -10% 0px' },
  );
} else {
  document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    el.setAttribute(VISIBLE_ATTR, 'true');
  });
}
