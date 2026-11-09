import type { Chapter } from '../data/chapters';
import type { PromptPart, Trend } from '../data/future';
import type { Capability, Rich, TimelineEntry } from '../data/types';

export type Lang = 'en' | 'hy';
export const LANGS: readonly Lang[] = ['en', 'hy'];

export interface DemoCopy {
  title: string;
  intro: Rich;
  notes: Rich[];
}

/** Every piece of fixed interface text used by the build-time templates. */
export interface UiStrings {
  skip: string;
  brand: string;
  chapters: string;
  chapter: (n: string) => string;
  menuHint: Rich;
  keysHint: Rich;
  language: string;
  hero: {
    eyebrow: string;
    sub: string;
    author: string;
    cta: string;
    manifesto: Rich;
    manifestoCta: string;
    scroll: string;
  };
  timeline: {
    aria: string;
    navAria: string;
    underHood: string;
    illustration: string;
    agentMock: { title: string; items: Rich[] };
    genuiMock: { title: string; message: string; chips: string[]; chartAria: string };
  };
  hood: {
    eyebrow: string;
    aria: string;
    tokens: DemoCopy & {
      inputLabel: string;
      sample: string;
      tokens: string;
      characters: string;
      ratio: string;
      showIds: string;
      loading: string;
    };
    sampling: DemoCopy & { barsAria: string };
    attention: DemoCopy & { sentenceAria: string; readout: string };
    training: DemoCopy & { stages: [string, string, string][] };
    streaming: DemoCopy & { question: string; send: string; stop: string };
  };
  caps: {
    aria: string;
    howTo: string;
    howToAria: string;
    underHood: string;
    tryIt: string;
    copy: string;
    devTip: string;
    flowAria: string;
  };
  playbook: {
    aria: string;
    promptEyebrow: string;
    promptTitle: string;
    promptIntro: Rich;
  };
  future: { aria: string; forUs: string };
  outro: {
    eyebrow: string;
    title: string;
    sources: string;
    credits: string;
    note: string;
  };
  zoom: string;
}

/** Fully localised content for one language. */
export interface Content {
  lang: Lang;
  t: UiStrings;
  chapters: Chapter[];
  timeline: TimelineEntry[];
  capabilities: Capability[];
  trends: Trend[];
  promptAnatomy: PromptPart[];
}
