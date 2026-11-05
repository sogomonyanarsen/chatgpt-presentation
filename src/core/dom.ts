/** Typed query helpers that fail loudly when required markup is missing. */
// The generic narrows the return type for callers (e.g. qs<HTMLCanvasElement>) — intentional.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const qs = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T => {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
};

export const qsa = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] => Array.from(root.querySelectorAll<T>(selector));

/** Runs `init` once, the first time `el` approaches the viewport. Used to lazy-boot heavy demos. */
export const whenNearViewport = (el: Element, init: () => void, rootMargin = '50% 0px'): void => {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        init();
      }
    },
    { rootMargin },
  );
  io.observe(el);
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
