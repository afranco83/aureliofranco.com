import { animate } from 'motion';

const left = document.querySelector<HTMLElement>('[data-curtain="left"]');
const right = document.querySelector<HTMLElement>('[data-curtain="right"]');

if (left && right) {
  const fadeInOptions = { duration: 0.35, easing: 'ease-out' } as const;
  const slideOutOptions = { duration: 0.8, delay: 0.15, easing: 'ease-in-out' } as const;

  const revealContent = () => {
    left.remove();
    right.remove();

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-curtain-reveal]'),
    ).sort((a, b) => Number(a.dataset.curtainReveal) - Number(b.dataset.curtainReveal));

    revealTargets.forEach((el, index) => {
      setTimeout(() => el.setAttribute('data-visible', 'true'), index * 150);
    });
  };

  Promise.all([
    animate(left, { opacity: [0, 1] }, fadeInOptions).finished,
    animate(right, { opacity: [0, 1] }, fadeInOptions).finished,
  ])
    .then(() =>
      Promise.all([
        animate(left, { x: '-100%' }, slideOutOptions).finished,
        animate(right, { x: '100%' }, slideOutOptions).finished,
      ]),
    )
    .then(revealContent)
    .catch(revealContent);
}
