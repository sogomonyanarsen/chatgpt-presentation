import type { Capability } from './types';

export const capabilities: Capability[] = [
  {
    id: 'models',
    index: '01',
    name: 'Instant, Thinking & Pro',
    tagline: 'Choosing how hard it should think',
    glyph: 'brain',
    what: 'ChatGPT runs a family of models. <strong>Auto</strong> routes each message for you. <strong>Instant</strong> is fast, <strong>Thinking</strong> reasons step by step before answering, and <strong>Pro</strong> spends the most compute on the hardest problems.',
    steps: [
      'Open the model menu at the top of a chat.',
      'Leave it on <em>Auto</em> for everyday prompts.',
      'Pick <em>Thinking</em> (or say “think hard about this”) for architecture decisions, tricky bugs or maths.',
      'Use <em>Instant</em> for quick rewrites and lookups where speed matters more than depth.',
    ],
    hood: 'Thinking models generate hidden <em>reasoning tokens</em> first: they draft, check and backtrack, then write the visible answer. More reasoning tokens means better accuracy, but also more latency and cost. A router model makes that trade-off for each message.',
    flow: ['prompt', 'router', 'reasoning tokens', 'answer'],
    tryPrompt:
      'Think carefully: compare signals, RxJS and Redux for state in a large Angular + React micro-frontend. Give trade-offs in a table.',
    devTip:
      'If a fast answer is wrong, do not keep re-prompting the same mode. Switch to Thinking and give it the failing test.',
  },
  {
    id: 'search',
    index: '02',
    name: 'Search & Deep research',
    tagline: 'Live web, with citations',
    glyph: 'globe',
    what: '<strong>Search</strong> grounds answers in fresh web results with inline citations. <strong>Deep research</strong> is an agent that spends 5–30 minutes browsing dozens of sources and writes a cited report.',
    steps: [
      'Ask anything time-sensitive. ChatGPT searches automatically, or you can force it with <em>+ → Web search</em>.',
      'For Deep research, choose <em>+ → Deep research</em> and describe the goal.',
      'Answer its clarifying questions. They narrow the scope and noticeably improve the report.',
      'Let it run (you can leave), then check the citations panel and export the report.',
    ],
    hood: 'This is <em>retrieval-augmented generation</em>. The model writes search queries as tool calls, fetches and parses pages, and puts the relevant chunks into its context window. It then answers with references back to those chunks. Deep research runs this loop many times with a reasoning model, deciding after each step what to look for next.',
    flow: ['query', 'search tool', 'fetch + chunk', 'context', 'cited answer'],
    tryPrompt:
      'Deep research: current browser support and real-world adoption of CSS anchor positioning, View Transitions and Popover API. Cite MDN / caniuse.',
    devTip:
      'Your knowledge of library versions is only as good as the model’s training cutoff. Ask it to <em>search the docs</em> for anything released recently.',
  },
  {
    id: 'vision',
    index: '03',
    name: 'Vision & Images',
    tagline: 'Screenshot in, component out',
    glyph: 'eye',
    what: 'Paste screenshots, mock-ups, whiteboard photos or error dialogs and ChatGPT reads them. It also <strong>generates and edits images</strong>, and is good at rendering legible text inside them.',
    steps: [
      'Drag a screenshot of a design into the composer (or paste with ⌘V).',
      'Ask for a specific output, e.g. “React + SCSS, BEM, CSS grid, no Tailwind”.',
      'To generate an image, describe subject, style, aspect ratio and any text it must contain.',
      'To edit, select a region of a generated image and describe the change.',
    ],
    hood: 'A vision encoder cuts the image into <em>patches</em> (small tiles) and turns each one into an embedding. The language model sees those embeddings as ordinary tokens. Image generation in ChatGPT is <em>native</em>: the same multimodal model produces the image, rather than handing off to a separate diffusion model as DALL·E did. That is why it follows detailed instructions and spells words correctly.',
    flow: ['image', 'patches', 'embeddings', 'transformer', 'text / image'],
    tryPrompt:
      'Here is a screenshot of our settings page. Rebuild it as an accessible Angular standalone component with SCSS. Use semantic HTML and visible focus states.',
    devTip:
      'Crop screenshots to the part that matters, and say which breakpoint the screenshot shows.',
  },
  {
    id: 'voice',
    index: '04',
    name: 'Voice & Camera',
    tagline: 'Real-time, interruptible',
    glyph: 'wave',
    what: 'Talk to it hands-free with natural turn-taking. You can interrupt mid-sentence, share your camera or screen, and switch languages on the fly.',
    steps: [
      'Tap the voice (waveform) button in the composer.',
      'Speak naturally. Interrupt it any time and it will stop and listen.',
      'On mobile, turn on the camera or screen share and ask about what it sees.',
      'The transcript stays in the chat, so you can continue by typing.',
    ],
    hood: 'A <em>speech-to-speech</em> model consumes audio tokens and emits audio tokens directly. No text round-trip is needed, so tone and pacing survive. In the browser, the Realtime API streams audio over <strong>WebRTC</strong> with server-side voice-activity detection, which is how barge-in (interrupting) works.',
    flow: ['mic', 'WebRTC', 'audio tokens', 'model', 'audio out'],
    code: {
      lang: 'ts',
      label: 'Realtime voice in the browser (sketch)',
      source: `const pc = new RTCPeerConnection();
const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
pc.addTrack(mic.getTracks()[0], mic);
pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
// POST the SDP offer to your backend, which talks to the Realtime API
const answer = await fetch('/api/realtime-session', { method: 'POST', body: offer.sdp });
await pc.setRemoteDescription({ type: 'answer', sdp: await answer.text() });`,
    },
    devTip:
      'Use voice for rubber-duck debugging during a walk. Paste the transcript into a Thinking chat afterwards.',
  },
  {
    id: 'canvas',
    index: '05',
    name: 'Canvas & Intelligent UI',
    tagline: 'Answers you can interact with',
    glyph: 'canvas',
    what: '<strong>Canvas</strong> opens a side-by-side editor for docs and code: inline edits, comments, and running code in the browser. Since GPT-6, <strong>Intelligent UI</strong> puts interactive charts, calculators, maps and controls directly into replies.',
    steps: [
      'Ask for a document or code, or say “open this in canvas”.',
      'Select any part of the text or code and ask for a targeted change.',
      'Use the shortcuts: review code, add logs, add comments, port to another language.',
      'For visual answers, ask for something explorable (“let me compare…”). Turn visuals down in Personalization if you prefer plain text.',
    ],
    hood: 'Canvas is a structured document the model edits through <em>diff-style tool calls</em> instead of rewriting everything. Generative UI goes a step further: the model emits a <em>component specification</em> (type plus props/data), and the client renders it from a trusted component library. This is the same idea as tool calls mapping to React components in Vercel’s AI SDK.',
    flow: ['intent', 'component spec (JSON)', 'trusted renderer', 'interactive UI'],
    code: {
      lang: 'json',
      label: 'What a generative-UI payload conceptually looks like',
      source: `{
  "component": "LineChart",
  "props": {
    "title": "Bundle size per release",
    "x": ["v1.0", "v1.1", "v1.2", "v2.0"],
    "series": [{ "name": "KB (gzip)", "data": [182, 176, 161, 129] }]
  }
}`,
    },
    devTip:
      'This is where UI engineering is heading. Well-typed components with clear prop contracts are what an AI can compose safely.',
  },
  {
    id: 'memory',
    index: '06',
    name: 'Memory, Projects & GPTs',
    tagline: 'Context that persists',
    glyph: 'memory',
    what: '<strong>Memory</strong> remembers your preferences across chats. <strong>Projects</strong> group chats with shared files and instructions. <strong>Custom GPTs</strong> package instructions, knowledge and actions into a reusable assistant.',
    steps: [
      'Settings → Personalization: set custom instructions, e.g. “I’m a UI engineer at SoftConstruct. Default to TypeScript, SCSS, Angular and React.”',
      'Turn on <em>Reference saved memories</em> and <em>chat history</em>, or use a Temporary Chat for one-offs.',
      'Create a Project per initiative and upload the spec, design tokens and style guide.',
      'Build a GPT (Explore GPTs → Create) for a repeatable job such as “BEM/SCSS reviewer”.',
    ],
    hood: 'There is no long-term learning in the weights. Instructions and saved memories are injected into the <em>system prompt</em>. Chat history and project files are split into chunks, <em>embedded as vectors</em>, and the most relevant ones are retrieved into the context window on each turn.',
    flow: ['files / history', 'chunk', 'embed', 'vector search', 'context window'],
    tryPrompt:
      'Remember: our design system uses 4px spacing, BEM naming and SCSS modules. Always follow it in UI answers.',
    devTip:
      'Never upload secrets, customer data or proprietary code unless your company plan and policy allow it. Check with your team lead first.',
  },
  {
    id: 'plugins',
    index: '07',
    name: 'Plugins & MCP',
    tagline: 'ChatGPT as a platform you build for',
    glyph: 'plug',
    what: 'Plugins (formerly apps/connectors) connect ChatGPT to Gmail, Drive, GitHub, Figma, Jira and 1,000+ other services, and can render <strong>your own UI inside the chat</strong>. They are built on the open <strong>Model Context Protocol</strong>.',
    steps: [
      'Browse the Plugin Directory and connect the tools you use.',
      'In a chat, <em>@mention</em> a plugin to pull its context into the task.',
      'To build one: expose tools from an MCP server, then add an HTML UI resource.',
      'Connect your server in developer mode, test it in ChatGPT, then package and submit it.',
    ],
    hood: 'An MCP server advertises <em>tools</em> (JSON-Schema functions). The model decides when to call them, and your server returns <code>structuredContent</code>. If the tool links a UI resource (<code>text/html;profile=mcp-app</code>), ChatGPT renders your HTML in a sandboxed <strong>iframe</strong> and passes data over a <code>postMessage</code> JSON-RPC bridge.',
    flow: ['model', 'tools/call', 'your MCP server', 'structuredContent', 'your iframe UI'],
    code: {
      lang: 'ts',
      label: 'MCP tool that renders UI in ChatGPT',
      source: `server.registerTool('show_release_board', {
  title: 'Show release board',
  inputSchema: { project: z.string() },
  _meta: { ui: { resourceUri: 'ui://board/v1.html' } }, // ← render in chat
}, async ({ project }) => ({
  structuredContent: { project, columns: await getBoard(project) },
  content: [{ type: 'text', text: \`Board for \${project}\` }],
}));

// inside the iframe (ui://board/v1.html)
app.ontoolresult = (result) => render(result.structuredContent);
await app.connect(); // JSON-RPC 2.0 over postMessage`,
    },
    devTip:
      'If you can build a widget in React or Angular, you can build a ChatGPT plugin. It is a small web app plus a typed tool contract.',
  },
  {
    id: 'agent',
    index: '08',
    name: 'Agent & ChatGPT Work',
    tagline: 'Give it an outcome, not steps',
    glyph: 'robot',
    what: 'The agent uses its own browser, terminal, your plugins and (on desktop) your computer to <strong>finish multi-step jobs</strong>. It returns docs, slides, spreadsheets and live web apps, and can run on a schedule.',
    steps: [
      'Describe the outcome: “Prepare a QA report of our checkout flow on staging with screenshots.”',
      'Review the plan it proposes (Plan mode) and adjust it before it starts.',
      'Set approvals: what it may access, and which actions need your sign-off.',
      'Watch, steer or take over at any time. Optionally make it a scheduled task.',
    ],
    hood: 'An agent is a <em>loop</em>. On each step the model looks at the current state (screenshot, DOM / accessibility tree, terminal output) and picks one action (click, type, call a tool), observes the result, and repeats until done. Computer use works on <em>pixels</em>: it predicts mouse coordinates and keystrokes. Separate safety models screen for prompt injection and confirm sensitive actions.',
    flow: ['observe', 'think', 'act', 'verify', '↻'],
    tryPrompt:
      'Open our staging site, run through sign-up on mobile viewport, and give me a table of every a11y and layout issue with screenshots.',
    devTip:
      'Web pages can contain hidden instructions aimed at agents (prompt injection). Keep agents logged out of anything sensitive unless the task needs it.',
  },
  {
    id: 'codex',
    index: '09',
    name: 'Codex',
    tagline: 'A coding agent for your repo',
    glyph: 'code',
    what: 'Codex reads your repository, writes code, runs your tests and opens pull requests. It runs in the cloud, in your terminal (CLI) and in the ChatGPT desktop app. It is also handy for reviewing PRs.',
    steps: [
      'Connect GitHub, or install the CLI: <code>npm i -g @openai/codex</code> and run <code>codex</code> in your repo.',
      'Add an <code>AGENTS.md</code> with how to install, lint, test and the conventions to follow.',
      'Give scoped tasks: “Migrate <code>UserCard</code> to standalone + signals, keep tests green.”',
      'Review the diff like a teammate’s PR. Ask for changes or merge.',
    ],
    hood: 'Each task gets an isolated <em>sandbox container</em> with your repo checked out. The model reads files, edits them, runs shell commands (lint, unit tests, build), reads the output and iterates. <code>AGENTS.md</code> is just text placed in its context, like a README for agents.',
    flow: ['task', 'sandbox clone', 'edit', 'run tests', 'PR'],
    code: {
      lang: 'md',
      label: 'AGENTS.md',
      source: `# AGENTS.md
- Install: \`npm ci\`
- Verify before finishing: \`npm run lint && npm test && npm run build\`
- Styles: SCSS + BEM, tokens from \`src/styles/_tokens.scss\`, no inline styles
- Angular: standalone components, signals, OnPush
- Never commit secrets or edit generated files in \`/dist\``,
    },
    devTip:
      'Small, well-scoped tasks with a test that proves “done” give far better results than “refactor the app”.',
  },
  {
    id: 'atlas',
    index: '10',
    name: 'ChatGPT Atlas',
    tagline: 'The browser with ChatGPT built in',
    glyph: 'browser',
    what: 'Atlas is OpenAI’s web browser (Oct 2025). A ChatGPT sidebar understands the page you are on, and <strong>agent mode</strong> can navigate, fill in forms and complete tasks across your tabs.',
    steps: [
      'Install Atlas and import bookmarks and passwords from your current browser.',
      'Open the <em>Ask ChatGPT</em> sidebar on any page: “Summarise this PR”, “Explain this stack trace”.',
      'Use the cursor chat to rewrite text in any input field in place.',
      'Turn on agent mode for multi-tab tasks. Decide per site what it may see.',
    ],
    hood: 'The agent reads pages through the <em>DOM and accessibility tree</em> as well as screenshots. Roles, names, labels and landmarks are how it finds “the Submit button”. Browser memories (optional) store summaries of visited pages for later retrieval.',
    flow: ['page', 'a11y tree + pixels', 'model', 'click / type'],
    devTip:
      'Semantic HTML and correct ARIA are now about agents too. An inaccessible <code>&lt;div onclick&gt;</code> is hard for AI agents to use, just as it is for screen readers.',
  },
];
