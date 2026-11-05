const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Respect the OS “reduce motion” setting: no scroll-jacking, no warp, no dive transforms. */
export const prefersReducedMotion = (): boolean => reducedQuery.matches;

/** Breakpoint where the horizontal timeline and dive effects are enabled. */
export const DESKTOP_QUERY = '(min-width: 900px)';
export const MOBILE_QUERY = '(max-width: 899.98px)';
