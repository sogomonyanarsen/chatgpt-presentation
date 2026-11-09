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
    title: 'How ChatGPT began',
    lead: 'From a 2017 research paper to one of the most used apps in the world.',
  },
  {
    id: 'hood',
    number: '02',
    title: 'Under the hood',
    lead: 'How it actually works, explained with five small demos you can play with.',
  },
  {
    id: 'capabilities',
    number: '03',
    title: 'Capabilities',
    lead: 'What ChatGPT can do today: and how to use each feature.',
  },
  {
    id: 'playbook',
    number: '04',
    title: 'Playbook',
    lead: 'Practical tips for using it well in our daily work.',
  },
  {
    id: 'future',
    number: '05',
    title: 'What’s next',
    lead: 'Where this is heading, and what it means for people who build interfaces.',
  },
  { id: 'outro', number: '06', title: 'Q & A', lead: '' },
];
