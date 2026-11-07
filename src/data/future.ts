import type { Rich } from './types';

export interface Trend {
  title: string;
  body: Rich;
  forUs: Rich;
}

export const trends: Trend[] = [
  {
    title: 'Agents that work for hours',
    body: 'AI went from answering one question to working on a task for hours: making a plan, using tools, and checking its own work.',
    forUs:
      'Expect pull requests and QA reports written by AI. Writing clear tasks, reviewing and testing become key skills.',
  },
  {
    title: 'Interfaces generated on demand',
    body: 'With Intelligent UI and plugins, parts of the screen are put together by AI on the fly, using components it is allowed to use.',
    forUs:
      'We build <em>solid component libraries</em> (clear props, design tokens, accessibility) that both people and AI can use.',
  },
  {
    title: 'Agents as users',
    body: 'AI browsers like Atlas visit websites for people. They read the HTML structure and labels to find their way.',
    forUs:
      'Semantic HTML, clear labels and simple flows help AI use our sites. Good accessibility now helps robots too.',
  },
  {
    title: 'Real-time, multimodal by default',
    body: 'Talking with AI, showing it your camera or screen, getting answers instantly. It feels like a video call.',
    forUs:
      'Live-updating interfaces (streaming text, “stop” buttons, voice) become normal front-end work.',
  },
  {
    title: 'ChatGPT as an operating layer',
    body: 'Shopping, documents, health, finance: ChatGPT is becoming a “super app” where people do things without visiting websites.',
    forUs:
      'Some of our product surface will live inside ChatGPT as a plugin UI, not only on our own domain.',
  },
  {
    title: 'The open problems',
    body: 'AI still makes things up, can be tricked by hidden instructions, raises privacy questions, and uses a lot of energy.',
    forUs:
      'Always check its work, keep a human approving important actions, and treat AI output like <em>user input</em>: never trust it blindly.',
  },
];

export interface PromptPart {
  key: string;
  label: string;
  text: string;
}

/** Anatomy of a strong prompt for front-end work. */
export const promptAnatomy: PromptPart[] = [
  {
    key: 'role',
    label: 'Role & context',
    text: 'You are reviewing code for a betting-platform UI team (Angular 20 + React 19, SCSS, BEM).',
  },
  {
    key: 'task',
    label: 'Task',
    text: 'Refactor the component below to be accessible and responsive.',
  },
  {
    key: 'constraints',
    label: 'Constraints',
    text: 'Keep the public API. No new dependencies. Mobile-first, 4px spacing scale.',
  },
  {
    key: 'format',
    label: 'Output format',
    text: 'Return: 1) the diff, 2) a bullet list of a11y fixes, 3) unit-test cases.',
  },
  {
    key: 'examples',
    label: 'Examples / data',
    text: '<paste component + a screenshot of the broken mobile layout>',
  },
];

export const checklist: Rich[] = [
  'Set <strong>custom instructions</strong> with our stack and conventions.',
  'Use <strong>Thinking</strong> for architecture and debugging, and <strong>Instant</strong> for boilerplate.',
  'Create a <strong>Project</strong> per feature with the spec and design tokens.',
  'Add an <code>AGENTS.md</code> to repos and try <strong>Codex</strong> on one small ticket.',
  'Build one internal <strong>plugin</strong> (MCP + UI) to learn how the platform works.',
  'Always <strong>verify</strong>: run it, test it, read the diff.',
];
