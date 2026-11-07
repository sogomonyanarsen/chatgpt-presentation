import type { Capability } from './types';

export const capabilities: Capability[] = [
  {
    id: 'models',
    index: '01',
    name: 'Instant, Thinking & Pro',
    tagline: 'Fast answer or careful answer',
    glyph: 'brain',
    image: {
      src: 'images/server-racks.webp',
      width: 1200,
      height: 900,
      alt: 'Rows of server racks in a data centre',
      credit: 'serverRacks',
      kind: 'photo',
    },
    what: 'ChatGPT has several “gears”. <strong>Instant</strong> answers right away. <strong>Thinking</strong> takes a moment to work things out first. <strong>Pro</strong> thinks the longest for the hardest problems. <strong>Auto</strong> picks for you.',
    steps: [
      'Open the model menu at the top of the chat.',
      'Leave it on <em>Auto</em> for everyday questions.',
      'Switch to <em>Thinking</em> (or just write “think hard”) for tricky bugs and design decisions.',
      'Use <em>Instant</em> for quick rewrites and small questions.',
    ],
    hood: 'In Thinking mode the model writes itself hidden notes first: it tries an idea, checks it, and fixes mistakes. Only then does it write the answer you see. More thinking usually means a better answer, but a slower one.',
    flow: ['your question', 'pick a gear', 'think (hidden)', 'answer'],
    tryPrompt:
      'Think carefully: should our Angular + React app keep shared state in signals, RxJS or Redux? Compare them in a simple table.',
    devTip:
      'If a quick answer is wrong, don’t just ask again. Switch to Thinking and paste the error or the failing test.',
  },
  {
    id: 'search',
    index: '02',
    name: 'Search & Deep research',
    tagline: 'Fresh answers from the web, with sources',
    glyph: 'globe',
    image: {
      src: 'images/magnifier.webp',
      width: 640,
      height: 480,
      alt: 'Magnifying glass over the page of a book',
      credit: 'magnifier',
      kind: 'photo',
    },
    what: '<strong>Search</strong> looks things up on the web and shows its sources. <strong>Deep research</strong> spends 5–30 minutes reading dozens of pages and writes you a full report with links.',
    steps: [
      'Ask about anything recent. ChatGPT searches automatically, or choose <em>+ → Web search</em>.',
      'For a report, choose <em>+ → Deep research</em> and describe what you need.',
      'Answer its follow-up questions. They make the report much better.',
      'Come back when it’s done and check the linked sources.',
    ],
    hood: 'The model can’t know anything newer than its training. So it searches the web, opens the most useful pages, and pastes the relevant parts into its own “memory” for this chat. Then it answers using those pages and links to them. Deep research repeats this many times, deciding what to look up next.',
    flow: ['question', 'search', 'read pages', 'answer + links'],
    tryPrompt:
      'Deep research: which browsers support CSS anchor positioning and the View Transitions API today? Link to MDN or caniuse.',
    devTip:
      'Libraries change fast. Ask it to <em>search the docs</em> for anything released recently, so it doesn’t give you an old API.',
  },
  {
    id: 'vision',
    index: '03',
    name: 'Vision & Images',
    tagline: 'Screenshot in, component out',
    glyph: 'eye',
    image: {
      src: 'images/eye.webp',
      width: 1400,
      height: 758,
      alt: 'Close-up of a human eye',
      credit: 'eye',
      kind: 'photo',
    },
    what: 'Paste a screenshot, a design, a photo of a whiteboard or an error message, and ChatGPT understands it. It can also <strong>create and edit images</strong>, including readable text inside them.',
    steps: [
      'Drag a screenshot into the chat (or paste with ⌘V).',
      'Say exactly what you want back, e.g. “React + SCSS, BEM, no Tailwind”.',
      'To create an image, describe the subject, style, size and any text it needs.',
      'To edit one, select an area of the image and describe the change.',
    ],
    hood: 'The image is cut into small squares, and each square is turned into numbers the model can read, just like words. So for the model, a screenshot is simply more “words” in the conversation. Image creation now happens inside the same model, which is why it follows instructions and spells text correctly.',
    flow: ['image', 'small squares', 'numbers', 'model', 'answer'],
    tryPrompt:
      'Here is a screenshot of our settings page. Rebuild it as an accessible Angular component with SCSS and visible focus states.',
    devTip: 'Crop the screenshot to the part you care about, and say which screen size it shows.',
  },
  {
    id: 'voice',
    index: '04',
    name: 'Voice & Camera',
    tagline: 'Talk to it like a person',
    glyph: 'wave',
    image: {
      src: 'images/microphone.webp',
      width: 990,
      height: 1344,
      alt: 'Studio microphone with a pop shield',
      credit: 'microphone',
      kind: 'photo',
    },
    what: 'Have a spoken conversation. Interrupt it mid-sentence, show it things through your camera or screen, and switch languages whenever you like.',
    steps: [
      'Tap the voice (waveform) button next to the chat box.',
      'Just talk. Interrupt any time and it stops to listen.',
      'On your phone, turn on the camera or share your screen and ask about what it sees.',
      'The conversation is saved as text, so you can carry on typing later.',
    ],
    hood: 'The model listens to sound and replies with sound directly, without turning everything into text first. That keeps your tone and timing. In the browser, the audio streams over <strong>WebRTC</strong>, the same tech as video calls, which is why it feels live.',
    flow: ['your voice', 'live audio stream', 'model', 'spoken reply'],
    devTip:
      'Great for “rubber-duck” debugging while walking. Paste the transcript into a Thinking chat afterwards.',
  },
  {
    id: 'canvas',
    index: '05',
    name: 'Canvas & Intelligent UI',
    tagline: 'Answers you can click and edit',
    glyph: 'canvas',
    image: {
      src: 'images/css-code.webp',
      width: 1400,
      height: 933,
      alt: 'CSS code on a computer screen',
      credit: 'cssCode',
      kind: 'photo',
    },
    what: '<strong>Canvas</strong> opens a side editor for documents and code, where you can select a part and ask for changes. Since GPT-6, <strong>Intelligent UI</strong> puts charts, calculators and buttons right inside the answer.',
    steps: [
      'Ask for a document or some code, or say “open this in canvas”.',
      'Highlight any part and ask for a change just there.',
      'Use the quick actions: review code, add comments, translate to another language.',
      'For visual answers, ask for something to explore (“let me compare…”). You can turn visuals down in Personalization.',
    ],
    hood: 'Instead of only writing text, the model can say “show a line chart with this data”. The app then draws it using its own ready-made components. It’s like the AI filling in props for components that developers built in advance.',
    flow: ['your question', 'AI picks a component', 'app renders it', 'you interact'],
    code: {
      lang: 'json',
      label: 'Roughly what the AI sends to the app',
      source: `{
  "component": "LineChart",
  "props": {
    "title": "Bundle size per release",
    "x": ["v1.0", "v1.1", "v1.2", "v2.0"],
    "series": [{ "name": "KB", "data": [182, 176, 161, 129] }]
  }
}`,
    },
    devTip:
      'This is where UI work is heading: well-designed components with clear props that an AI can safely use.',
  },
  {
    id: 'memory',
    index: '06',
    name: 'Memory, Projects & GPTs',
    tagline: 'It remembers what matters',
    glyph: 'memory',
    image: {
      src: 'images/card-catalog.webp',
      width: 1050,
      height: 1400,
      alt: 'Wooden library card catalogue drawers',
      credit: 'cardCatalog',
      kind: 'photo',
    },
    what: '<strong>Memory</strong> remembers your preferences between chats. <strong>Projects</strong> keep related chats, files and instructions together. <strong>GPTs</strong> are reusable assistants you set up once.',
    steps: [
      'Settings → Personalization: tell it about you, e.g. “I’m a UI developer. Default to TypeScript, SCSS, Angular and React.”',
      'Turn on memory, or use a Temporary Chat when you don’t want it to remember.',
      'Make a Project for each feature and upload the spec and design tokens.',
      'Create a GPT (Explore GPTs → Create) for a job you repeat, like “SCSS/BEM reviewer”.',
    ],
    hood: 'The model itself doesn’t learn from your chats. Instead, ChatGPT keeps notes about you and quietly adds them to the start of each new chat. For files and old chats, it searches for the parts related to your question and adds only those.',
    flow: ['your files & notes', 'find relevant bits', 'add to the chat', 'answer'],
    tryPrompt:
      'Remember: our design system uses a 4px spacing scale, BEM naming and SCSS modules. Always follow it in UI answers.',
    devTip:
      'Don’t upload passwords, customer data or private code unless our company plan and rules allow it. Ask your team lead first.',
  },
  {
    id: 'plugins',
    index: '07',
    name: 'Plugins',
    tagline: 'Connect ChatGPT to your tools',
    glyph: 'plug',
    image: {
      src: 'images/patch-panel.webp',
      width: 656,
      height: 1200,
      alt: 'Network cables plugged into a patch panel',
      credit: 'patchPanel',
      kind: 'photo',
    },
    what: 'Plugins (previously called apps) connect ChatGPT to Gmail, Drive, GitHub, Figma, Jira and 1,000+ more. They can even show <strong>your own UI inside the chat</strong>.',
    steps: [
      'Open the Plugin Directory and connect the tools you use.',
      'In a chat, type <em>@</em> and the plugin name to bring it in.',
      'To build one: write a small server that offers “tools” (functions), plus an optional HTML page for the UI.',
      'Test it in ChatGPT’s developer mode, then submit it.',
    ],
    hood: 'A plugin is a small server that tells ChatGPT “here are the things I can do”. When the AI needs one, it calls it like an API and gets data back. If the plugin has a UI, ChatGPT shows your HTML in a frame (an <strong>iframe</strong>) inside the chat and passes the data to it.',
    flow: ['AI', 'calls your tool', 'your server', 'data', 'your UI in chat'],
    code: {
      lang: 'ts',
      label: 'A plugin tool that shows UI in ChatGPT (simplified)',
      source: `server.registerTool('show_release_board', {
  title: 'Show release board',
  inputSchema: { project: z.string() },
  _meta: { ui: { resourceUri: 'ui://board/v1.html' } }, // ← show our UI
}, async ({ project }) => ({
  structuredContent: { project, columns: await getBoard(project) },
}));

// inside our HTML page (shown in the chat)
app.ontoolresult = (result) => render(result.structuredContent);`,
    },
    devTip:
      'If you can build a widget in React or Angular, you can build a ChatGPT plugin. It’s a small web app plus a clear list of functions.',
  },
  {
    id: 'agent',
    index: '08',
    name: 'Agent & ChatGPT Work',
    tagline: 'Describe the result, not the steps',
    glyph: 'robot',
    image: {
      src: 'images/robot-arm.webp',
      width: 933,
      height: 1400,
      alt: 'An industrial robotic arm at work in a factory',
      credit: 'robotArm',
      kind: 'photo',
    },
    what: 'The agent uses its own browser, your plugins and (on desktop) your computer to <strong>finish multi-step jobs</strong>. It hands back docs, slides, spreadsheets or small web apps, and can run on a schedule.',
    steps: [
      'Describe the result: “Make a QA report of our checkout flow on staging, with screenshots.”',
      'Check the plan it suggests and change it before it starts.',
      'Decide what it can access and which actions need your approval.',
      'Watch it work, give directions, or take over at any time.',
    ],
    hood: 'An agent repeats one simple loop: <em>look</em> at the screen, <em>decide</em> the next step, <em>do</em> it (click, type, use a tool), then <em>check</em> the result. It keeps going until the job is done. Extra safety checks watch for risky actions.',
    flow: ['look', 'decide', 'do', 'check', '↻'],
    tryPrompt:
      'Open our staging site on a phone-sized screen, go through sign-up, and list every layout or accessibility problem with screenshots.',
    devTip:
      'Web pages can hide instructions meant to trick agents. Don’t let an agent log into sensitive accounts unless the task really needs it.',
  },
  {
    id: 'codex',
    index: '09',
    name: 'Codex',
    tagline: 'A coding teammate for your repo',
    glyph: 'code',
    image: {
      src: 'images/code-monitor.webp',
      width: 1200,
      height: 800,
      alt: 'Source code on a computer monitor',
      credit: 'codeMonitor',
      kind: 'photo',
    },
    what: 'Codex reads your project, writes code, runs your tests and opens pull requests. It works in the cloud, in your terminal and in the ChatGPT desktop app. It’s also good at reviewing PRs.',
    steps: [
      'Connect GitHub, or install the CLI: <code>npm i -g @openai/codex</code> and run <code>codex</code> in your project.',
      'Add an <code>AGENTS.md</code> file that explains how to install, lint and test, and your code style.',
      'Give it small, clear tasks: “Convert <code>UserCard</code> to a standalone component, keep tests passing.”',
      'Review the changes like a teammate’s PR, then ask for fixes or merge.',
    ],
    hood: 'For each task Codex gets its own safe copy of your project. It reads files, edits them, runs commands like <code>npm test</code>, reads the output and tries again until things pass. <code>AGENTS.md</code> is simply a README written for the AI.',
    flow: ['task', 'copy of repo', 'edit', 'run tests', 'pull request'],
    code: {
      lang: 'md',
      label: 'AGENTS.md',
      source: `# AGENTS.md
- Install: \`npm ci\`
- Before finishing: \`npm run lint && npm test && npm run build\`
- Styles: SCSS + BEM, use tokens from \`src/styles/_tokens.scss\`
- Angular: standalone components, signals, OnPush
- Never commit secrets`,
    },
    devTip:
      'Small tasks with a test that proves “done” work far better than “refactor the whole app”.',
  },
  {
    id: 'atlas',
    index: '10',
    name: 'ChatGPT Atlas',
    tagline: 'A web browser with ChatGPT built in',
    glyph: 'browser',
    image: {
      src: 'images/browser.webp',
      width: 1299,
      height: 708,
      alt: 'A web browser window showing a website',
      credit: 'browser',
      kind: 'screenshot',
    },
    what: 'Atlas is OpenAI’s web browser. A ChatGPT sidebar understands the page you’re on, and <strong>agent mode</strong> can click through websites and fill in forms for you.',
    steps: [
      'Install Atlas and import your bookmarks and passwords.',
      'Open the <em>Ask ChatGPT</em> sidebar on any page: “Summarise this PR”, “Explain this error”.',
      'Select text in any input field and ask it to rewrite it there.',
      'Turn on agent mode for tasks across several tabs.',
    ],
    hood: 'The agent reads a page much like a screen reader does: through the HTML structure and accessibility labels, plus a screenshot. Labels and roles are how it finds “the Submit button”.',
    flow: ['web page', 'HTML + labels + screenshot', 'AI', 'click / type'],
    devTip:
      'Good semantic HTML and ARIA labels now help AI agents too. A clickable <code>&lt;div&gt;</code> without a label is as hard for an agent as for a screen reader.',
  },
];
