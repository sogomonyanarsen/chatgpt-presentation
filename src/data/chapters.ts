export interface Chapter {
  id: string;
  number: string;
  title: string;
  lead: string;
}

export const chapters: Chapter[] = [
  { id: 'intro', number: '00', title: 'Intro', lead: '' },
  {
    id: 'history',
    number: '01',
    title: 'Origins',
    lead: 'From a 2017 research paper to the fastest-growing app in history and beyond. Scroll sideways through nine years.',
  },
  {
    id: 'hood',
    number: '02',
    title: 'Under the hood',
    lead: 'Tokens, probabilities, attention, training and streaming. Five live demos, all running in your browser.',
  },
  {
    id: 'capabilities',
    number: '03',
    title: 'Capabilities',
    lead: 'What ChatGPT can do today (November 2026): how to use each feature, step by step, and how it works.',
  },
  {
    id: 'playbook',
    number: '04',
    title: 'Playbook',
    lead: 'Prompts, APIs and habits for UI engineers who want to use this well.',
  },
  {
    id: 'future',
    number: '05',
    title: 'What’s next',
    lead: 'Where this is heading, and what it means for people who build interfaces.',
  },
  { id: 'outro', number: '06', title: 'Q & A', lead: '' },
];
