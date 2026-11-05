/** Prompt anatomy: hovering/focusing a legend key highlights that part of the assembled prompt. */
export const initAnatomy = (root: HTMLElement): void => {
  const setActive = (event: Event): void => {
    const key = (event.target as Element).closest<HTMLElement>('[data-part]');
    if (key?.dataset.part) root.dataset.active = key.dataset.part;
  };
  const clear = (): void => {
    delete root.dataset.active;
  };
  root.addEventListener('pointerover', setActive);
  root.addEventListener('focusin', setActive);
  root.addEventListener('pointerleave', clear);
  root.addEventListener('focusout', clear);
};
