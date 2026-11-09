import type { Lang } from './types';

/** Strings created at runtime by TypeScript (the rest of the page is pre-rendered). */
interface RuntimeStrings {
  copy: string;
  copied: string;
  selectAndCopy: string;
  enlargedImage: string;
  closeImage: string;
  /** Attention demo readout for a word and its two strongest links. */
  attention: (word: string, top: { token: string; pct: number }[]) => string;
  streamAnswer: string;
}

const strings: Record<Lang, RuntimeStrings> = {
  en: {
    copy: 'Copy',
    copied: 'Copied ✓',
    selectAndCopy: 'Select & copy',
    enlargedImage: 'Enlarged image',
    closeImage: 'Close image',
    attention: (word, top) =>
      `“${word}” looks most at ${
        top.map((x) => `“${x.token}” ${x.pct}%`).join(', ') || 'itself'
      }. Greyed-out words come later, so it can’t see them yet.`,
    streamAnswer:
      'Specificity decides which CSS rule wins when several match the same element. Browsers score each selector as a tuple — (IDs, classes/attributes/pseudo-classes, elements) — and compare left to right, so one #id beats any number of classes. Inline styles outrank selectors, !important outranks both, and when scores tie the last declared rule wins. Keep it flat: BEM classes give every rule the same weight, so source order stays predictable.',
  },
  hy: {
    copy: 'Պատճենել',
    copied: 'Պատճենված է ✓',
    selectAndCopy: 'Նշեք և պատճենեք',
    enlargedImage: 'Մեծացված նկար',
    closeImage: 'Փակել նկարը',
    attention: (word, top) =>
      top.length
        ? `«${word}»-ն ամենաշատը նայում է ${top.map((x) => `«${x.token}» (${x.pct}%)`).join(' և ')} բառերին։ Մոխրագույն բառերը գալիս են հետո, ուստի այն դեռ չի տեսնում դրանք։`
        : `«${word}»-ն նայում է միայն ինքն իրեն։`,
    streamAnswer:
      'Specificity-ն որոշում է, թե որ CSS կանոնն է հաղթում, երբ մի քանի կանոն վերաբերում են նույն էլեմենտին։ Browser-ը ամեն selector-ի համար հաշվում է միավորներ՝ (ID-ներ, class-եր/attribute-ներ/pseudo-class-եր, էլեմենտներ), և համեմատում ձախից աջ, ուստի մեկ #id-ն հաղթում է ցանկացած քանակի class-երի։ Inline style-երն ավելի ուժեղ են, քան selector-ները, !important-ը՝ երկուսից էլ, իսկ հավասարության դեպքում հաղթում է վերջինը գրված կանոնը։ Պահեք ամեն ինչ հարթ. BEM class-երը բոլոր կանոններին տալիս են նույն կշիռը, և հերթականությունը մնում է կանխատեսելի։',
  },
};

export const pageLang = (): Lang => (document.documentElement.lang === 'hy' ? 'hy' : 'en');

export const rt = (): RuntimeStrings => strings[pageLang()];
