import { capabilities } from '../data/capabilities';
import { chapters } from '../data/chapters';
import { checklist, promptAnatomy, trends } from '../data/future';
import { timeline } from '../data/timeline';
import type { Capability, Figure, TimelineEntry } from '../data/types';
import {
  hyCapabilities,
  hyChapters,
  hyChecklist,
  hyFigures,
  hyPromptAnatomy,
  hyTimeline,
  hyTrends,
} from './hy-content';
import type { Content, Lang } from './types';
import { ui } from './ui';

/** Throw at build time when a translation is missing, instead of shipping mixed languages. */
const need = <T>(value: T | undefined, what: string): T => {
  if (value === undefined) throw new Error(`Missing Armenian translation: ${what}`);
  return value;
};

const localiseFigure = (fig: Figure): Figure => {
  const text = need(hyFigures[fig.src], `figure ${fig.src}`);
  return { ...fig, alt: text.alt, ...(text.caption ? { caption: text.caption } : {}) };
};

const localiseEntry = (entry: TimelineEntry): TimelineEntry => {
  const text = need(hyTimeline[entry.id], `timeline ${entry.id}`);
  return {
    ...entry,
    navLabel: text.navLabel,
    date: text.date,
    title: text.title,
    tag: text.tag,
    lead: text.lead,
    hood: text.hood,
    ...(entry.figures ? { figures: entry.figures.map(localiseFigure) } : {}),
    ...(entry.stats
      ? {
          stats: entry.stats.map((s, i) => ({
            value: s.value,
            label: need(text.stats?.[i], `timeline ${entry.id} stat ${i}`),
          })),
        }
      : {}),
  };
};

const localiseCapability = (cap: Capability): Capability => {
  const text = need(hyCapabilities[cap.id], `capability ${cap.id}`);
  return {
    ...cap,
    name: text.name,
    tagline: text.tagline,
    what: text.what,
    steps: text.steps,
    hood: text.hood,
    ...(cap.image ? { image: localiseFigure(cap.image) } : {}),
    ...(cap.flow ? { flow: need(text.flow, `capability ${cap.id} flow`) } : {}),
    ...(cap.tryPrompt ? { tryPrompt: need(text.tryPrompt, `capability ${cap.id} prompt`) } : {}),
    ...(cap.devTip ? { devTip: need(text.devTip, `capability ${cap.id} tip`) } : {}),
    // Code stays in English; only its caption is translated.
    ...(cap.code ? { code: { ...cap.code, label: text.codeLabel ?? cap.code.label } } : {}),
  };
};

const english: Content = {
  lang: 'en',
  t: ui.en,
  chapters,
  timeline,
  capabilities,
  trends,
  promptAnatomy,
  checklist,
};

const armenian = (): Content => ({
  lang: 'hy',
  t: ui.hy,
  chapters: chapters.map((c) => ({ ...c, ...need(hyChapters[c.id], `chapter ${c.id}`) })),
  timeline: timeline.map(localiseEntry),
  capabilities: capabilities.map(localiseCapability),
  trends: trends.map((tr, i) => need(hyTrends[i], `trend ${i} (${tr.title})`)),
  promptAnatomy: promptAnatomy.map((p) => ({
    ...p,
    ...need(hyPromptAnatomy[p.key], `prompt ${p.key}`),
  })),
  checklist: checklist.map((_, i) => need(hyChecklist[i], `checklist ${i}`)),
});

export const getContent = (lang: Lang): Content => (lang === 'hy' ? armenian() : english);
