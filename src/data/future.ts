import type { Rich } from './types';

export interface Trend {
  title: string;
  body: Rich;
  forUs: Rich;
}

export const trends: Trend[] = [
  {
    title: 'Agents that work for hours',
    body: 'Task length is the metric to watch. We went from answering one question to running multi-hour jobs across tools with plan, approval and verification steps.',
    forUs:
      'Expect PRs, QA passes and migrations written by agents. Reviewing, specifying and testing become core skills.',
  },
  {
    title: 'Interfaces generated on demand',
    body: 'Intelligent UI and in-chat plugins mean part of the interface is assembled by a model at runtime, from components it is allowed to use.',
    forUs:
      'We ship <em>component systems with strict contracts</em> (typed props, tokens, a11y) that both humans and models can compose.',
  },
  {
    title: 'Agents as users',
    body: 'Browsers like Atlas and computer-use agents navigate sites for people, reading the DOM and the accessibility tree.',
    forUs:
      'Semantic HTML, stable labels and predictable flows become “agent SEO”. Accessibility is now also about automation.',
  },
  {
    title: 'Real-time, multimodal by default',
    body: 'Voice, camera and screen sharing at conversational latency. Models see what you see and talk while they think.',
    forUs:
      'Streaming UIs, optimistic rendering and interruptible states (WebRTC, SSE, AbortController) are everyday front-end work.',
  },
  {
    title: 'ChatGPT as an operating layer',
    body: 'Plugins, commerce, ads, health, finance, office docs: ChatGPT is turning into a “super app” that sits between users and websites.',
    forUs:
      'Some of our product surface will live inside ChatGPT as a plugin UI, not only on our own domain.',
  },
  {
    title: 'The open problems',
    body: 'Hallucinations, prompt injection, privacy, cost and energy, and how much to trust a reasoning process we cannot fully inspect.',
    forUs:
      'Verify outputs, keep humans approving irreversible actions, and treat model output as <em>untrusted input</em>.',
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
