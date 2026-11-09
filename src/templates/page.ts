import type { Content } from '../i18n/types';

/** Everything a template needs to render one localised page. */
export interface Page {
  c: Content;
  /** Prefix for assets in /public ('' for the root page, '../' for /hy/). */
  base: string;
}
