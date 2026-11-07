/**
 * Content model for the presentation.
 * Fields typed as `Rich` may contain trusted inline HTML (<em>, <code>, <strong>, <a>).
 * Everything is authored in this repo — never feed user input into these.
 */
export type Rich = string;

/** Visual theme of a timeline panel. Eras drift from archival paper to pure digital. */
export type PanelTheme = 'paper' | 'sage' | 'green' | 'ink' | 'void';

export interface Figure {
  src: string;
  /** Intrinsic size — reserves layout space so the horizontal track never shifts on image load. */
  width: number;
  height: number;
  alt: string;
  /** Key into `credits` — every image must be attributed. */
  credit: string;
  /** Diagrams are shown untinted; photos get the duotone treatment. */
  kind: 'photo' | 'diagram' | 'screenshot';
  caption?: string;
  /**
   * Focal point as a CSS `object-position` (e.g. '60% 22%'), so cropped frames keep the
   * subject (a face, a hand, a logo) in view. Defaults to the centre.
   */
  focus?: string;
  /** Render as the small offset “polaroid” instead of the main image. */
  polaroid?: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

export interface TimelineEntry {
  id: string;
  /** Short label for the bottom year navigation. */
  navLabel: string;
  date: string;
  title: string;
  /** Pixel “sticker” annotation, the digital cousin of a handwritten note. */
  tag: string;
  theme: PanelTheme;
  lead: Rich;
  /** Main image and/or a small offset “polaroid” (marked with `polaroid: true`). */
  figures?: Figure[];
  stats?: Stat[];
  /** Hand-built HTML illustration for eras without archival photos. */
  mock?: 'agent' | 'genui';
  hood: { title: string; body: Rich; code?: string };
}

export interface Capability {
  id: string;
  index: string;
  name: string;
  tagline: string;
  /** Pixel-art glyph rendered from a 7x7 bitmap (see templates/glyphs.ts). */
  glyph: string;
  image?: Figure;
  what: Rich;
  steps: Rich[];
  hood: Rich;
  /** Optional mini diagram: ordered nodes of a pipeline. */
  flow?: string[];
  code?: { lang: string; label: string; source: string };
  tryPrompt?: string;
  devTip?: Rich;
}

export interface Source {
  label: string;
  url: string;
}

export interface Credit {
  title: string;
  author: string;
  license: string;
  url: string;
}
