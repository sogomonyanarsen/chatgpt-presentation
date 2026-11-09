import type { Lang, UiStrings } from './types';

const en: UiStrings = {
  skip: 'Skip to content',
  brand: 'ChatGPT <span class="site-header__slash">//</span> Field Guide',
  chapters: 'Chapters',
  chapter: (n) => `Chapter ${n}`,
  menuHint:
    '<kbd>→</kbd> / <kbd>PgDn</kbd> next stop · <kbd>←</kbd> / <kbd>PgUp</kbd> previous · <kbd>M</kbd> menu · <kbd>Esc</kbd> close',
  keysHint:
    '<kbd>←</kbd><kbd>→</kbd> navigate <span class="keys-hint__sep">·</span> <kbd>M</kbd> chapters',
  language: 'Language',
  hero: {
    eyebrow: 'SoftConstruct · UI engineering talk · Nov 2026',
    sub: 'Origins, capabilities and what comes next, explained for people who build interfaces.',
    cta: 'Start the dive',
    manifesto:
      'In <strong>2017</strong> it was an idea in a research paper. By <strong>2026</strong> nearly <strong>a billion people</strong> use it every week, and it builds UIs, writes code and browses the web on its own.',
    manifestoCta: 'Let’s look at how.',
    scroll: 'scroll',
  },
  timeline: {
    aria: 'Timeline, 2017 to 2026',
    navAria: 'Timeline years',
    underHood: 'under the hood',
    illustration: 'Illustration · not a real screenshot',
    agentMock: {
      title: 'ChatGPT Work · plan',
      items: [
        'Pull last sprint’s tickets from Jira',
        'Run Lighthouse on staging, 3 viewports',
        'Draft QA report with screenshots',
        'Build slides for Friday demo',
        'Post summary to #ui-team <em>needs approval</em>',
      ],
    },
    genuiMock: {
      title: 'ChatGPT · Intelligent UI',
      message: 'Your bundle got 29% smaller since v1.0:',
      chips: ['gzip', 'brotli', 'per route'],
      chartAria: 'Bar chart: 182, 176, 161 and 129 KB',
    },
  },
  hood: {
    eyebrow: 'runs locally · no API key',
    aria: 'Under the hood demos',
    tokens: {
      title: 'Tokens, not words',
      intro:
        'AI models don’t read letters or words. They read <strong>tokens</strong>: common chunks of text, each with a number. Type below to see how ChatGPT really splits your text (this uses the <strong>real</strong> GPT vocabulary).',
      notes: [
        'Common English words are usually one token. Rare words, code, emoji and Armenian text take more.',
        '<strong>Prices and length limits are counted in tokens</strong>, not characters.',
        'This is why AI can miscount the letters in “strawberry”: it never sees single letters.',
      ],
      inputLabel: 'Type anything',
      sample:
        'SoftConstruct engineers ship &lt;button&gt;s, not buttons. Unbelievably, “strawberry” is just tokens to GPT. Բարև 👋',
      tokens: 'tokens',
      characters: 'characters',
      ratio: 'chars / token',
      showIds: 'show IDs',
      loading: 'Loading vocabulary…',
    },
    sampling: {
      title: 'Guessing the next word',
      intro:
        'At every step the model gives each possible next word a <strong>chance</strong>, then picks one, a bit like a weighted dice roll. It adds that word and repeats. Press <em>Sample</em> to roll the dice.',
      notes: [
        '<strong>Low temperature</strong> = safe and predictable (always the favourite). <strong>High temperature</strong> = more creative and random.',
        '<strong>top-p</strong> throws away the unlikely options before rolling, so answers don’t go off the rails.',
        'The numbers here are made up for the demo. A real model scores all ~200,000 tokens at every step.',
      ],
      barsAria: 'Next-token probabilities',
    },
    attention: {
      title: 'Attention: which words matter',
      intro:
        'To understand a word, the model looks back at the other words and decides which ones matter most. That’s <strong>attention</strong>. <strong>Hover over a word</strong> to see where it looks. Thicker line = more important.',
      notes: [
        'Try <strong>“it”</strong>: does it mean the bug or the build? Attention is how the model figures that out.',
        'Words can only look <em>back</em>, never ahead. That’s because the model writes one word at a time.',
        'Real models do this in many layers at once, each noticing different things (grammar, meaning, position).',
      ],
      sentenceAria: 'Sentence tokens',
      readout: 'Pick a word to see where it looks.',
    },
    training: {
      title: 'How a model becomes ChatGPT',
      intro:
        'An assistant is built in stages. The first stage gives it knowledge, and the later ones teach it how to behave.',
      notes: [
        'What it “knows” stops at the date of stage 01. For anything newer it needs web search.',
        'Its personality (tone, politeness, formatting) mostly comes from stages 02 and 03.',
      ],
      stages: [
        [
          'Pre-training',
          'Reads a huge part of the internet, books and code, guessing the next word over and over. Result: a model that knows a lot but just rambles.',
          'months · thousands of GPUs',
        ],
        [
          'Learning by example',
          'Studies thousands of good example conversations written by people, so it learns to behave like a helpful assistant.',
          'good examples',
        ],
        [
          'Human feedback',
          'People compare answers and pick the better one. The model is trained to give the kind of answers people prefer.',
          '👍 / 👎',
        ],
        [
          'Practice problems',
          'Solves maths and coding problems with checkable answers, and gets rewarded when its step-by-step thinking reaches the right result.',
          'right / wrong',
        ],
        [
          'Deployment',
          'The app around the model: instructions, web search, memory, safety filters and the fast/thinking switch. Together, that’s “ChatGPT”.',
          'the product',
        ],
      ],
    },
    streaming: {
      title: 'Why the text “types itself”',
      intro:
        'The model creates its answer one piece at a time, so the server sends each piece the moment it’s ready (using <strong>Server-Sent Events</strong>). The page adds them as they arrive, which is why the text appears to type itself. Press Send and watch the network messages on the right.',
      notes: [
        'Showing the first words quickly makes AI <em>feel</em> fast, even if the full answer takes a while. Always stream.',
        'Treat AI output like user input: <strong>sanitise it</strong> before putting it in the page.',
        'The code above is simplified to show the idea.',
      ],
      question: 'Explain CSS specificity in one paragraph.',
      send: 'Send',
      stop: 'Stop (AbortController)',
    },
  },
  caps: {
    aria: 'ChatGPT capabilities',
    howTo: 'how to use',
    howToAria: 'How to use it',
    underHood: 'under the hood',
    tryIt: 'try it',
    copy: 'Copy',
    devTip: 'dev tip',
    flowAria: 'Data flow',
  },
  playbook: {
    aria: 'Playbook for UI engineers',
    promptEyebrow: '4.1 · prompt anatomy',
    promptTitle: 'A prompt is a spec',
    promptIntro:
      'The AI only knows what you tell it. A good prompt reads like a good Jira ticket: who you are, what you need, the rules, the format you want, and an example.',
    apiEyebrow: '4.2 · the API in 15 lines',
    apiTitle: 'Build it into our products',
    apiIntro:
      'With the OpenAI API we can add ChatGPT-like features to our own products. Call it from the backend (never put the API key in the browser), stream the answer to the UI, and ask for <strong>JSON in a fixed shape</strong> when you want to render the result in components.',
    streamLabel: '1 · stream an answer (backend)',
    structuredLabel: '2 · screenshot in, typed JSON out',
    checklistEyebrow: '4.3 · start on monday',
    checklistTitle: 'Team checklist',
  },
  future: { aria: 'Future trends', forUs: 'for UI devs' },
  outro: {
    eyebrow: 'thank you',
    title: 'Questions?',
    lead: 'Bring a real task from your sprint and we will try it live.',
    sources: 'Sources',
    credits: 'Image credits',
    note: 'Facts current as of November 2026. Product details change quickly, so check the release notes before quoting.',
  },
  zoom: 'Enlarge image',
};

const hy: UiStrings = {
  skip: 'Անցնել բովանդակությանը',
  brand: 'ChatGPT <span class="site-header__slash">//</span> Ուղեցույց',
  chapters: 'Գլուխներ',
  chapter: (n) => `Գլուխ ${n}`,
  menuHint:
    '<kbd>→</kbd> / <kbd>PgDn</kbd> հաջորդը · <kbd>←</kbd> / <kbd>PgUp</kbd> նախորդը · <kbd>M</kbd> մենյու · <kbd>Esc</kbd> փակել',
  keysHint:
    '<kbd>←</kbd><kbd>→</kbd> անցում <span class="keys-hint__sep">·</span> <kbd>M</kbd> գլուխներ',
  language: 'Լեզու',
  hero: {
    eyebrow: 'SoftConstruct · UI թիմի ելույթ · Նոյեմբեր 2026',
    sub: 'Պատմությունը, հնարավորություններն ու ապագան՝ պարզ բացատրված UI ստեղծողների համար։',
    cta: 'Սկսենք',
    manifesto:
      '<strong>2017</strong>-ին սա ընդամենը գաղափար էր գիտական հոդվածում։ <strong>2026</strong>-ին այն ամեն շաբաթ օգտագործում է մոտ <strong>մեկ միլիարդ մարդ</strong>, իսկ ինքը UI է կառուցում, կոդ է գրում և ինտերնետում ինքնուրույն աշխատում։',
    manifestoCta: 'Տեսնենք՝ ինչպես։',
    scroll: 'scroll',
  },
  timeline: {
    aria: 'Ժամանակագրություն, 2017–2026',
    navAria: 'Տարիներ',
    underHood: 'ինչպես է աշխատում',
    illustration: 'Նկարազարդում · ոչ իրական screenshot',
    agentMock: {
      title: 'ChatGPT Work · պլան',
      items: [
        'Վերցնել անցած sprint-ի ticket-ները Jira-ից',
        'Գործարկել Lighthouse-ը staging-ում, 3 էկրանի չափով',
        'Գրել QA հաշվետվություն screenshot-ներով',
        'Պատրաստել սլայդներ ուրբաթվա demo-ի համար',
        'Ամփոփումն ուղարկել #ui-team <em>պետք է հաստատում</em>',
      ],
    },
    genuiMock: {
      title: 'ChatGPT · Intelligent UI',
      message: 'Ձեր bundle-ը v1.0-ից ի վեր 29%-ով փոքրացել է.',
      chips: ['gzip', 'brotli', 'ըստ route-ի'],
      chartAria: 'Գրաֆիկ. 182, 176, 161 և 129 KB',
    },
  },
  hood: {
    eyebrow: 'աշխատում է browser-ում · առանց API key',
    aria: 'Demo-ներ՝ ինչպես է աշխատում',
    tokens: {
      title: 'Token-ներ, ոչ թե բառեր',
      intro:
        'AI մոդելները տառեր կամ բառեր չեն կարդում։ Նրանք կարդում են <strong>token-ներ</strong>՝ տեքստի հաճախ հանդիպող կտորներ, որոնցից ամեն մեկն ունի իր համարը։ Գրեք ներքևում և տեսեք, թե ինչպես է ChatGPT-ն իրականում բաժանում ձեր տեքստը (օգտագործվում է <strong>իրական</strong> GPT բառարանը)։',
      notes: [
        'Հաճախ օգտագործվող անգլերեն բառերը սովորաբար մեկ token են։ Հազվագյուտ բառերը, կոդը, emoji-ները և հայերեն տեքստը ավելի շատ token են զբաղեցնում։',
        '<strong>Գներն ու երկարության սահմանափակումները հաշվվում են token-ներով</strong>, ոչ թե նիշերով։',
        'Ահա թե ինչու AI-ը կարող է սխալ հաշվել «strawberry» բառի տառերը. այն առանձին տառեր ընդհանրապես չի տեսնում։',
      ],
      inputLabel: 'Գրեք ցանկացած բան',
      sample:
        'SoftConstruct-ի ծրագրավորողները &lt;button&gt;-ներ են ստեղծում։ Բարև ձեզ 👋 Unbelievably, “strawberry” is just tokens to GPT.',
      tokens: 'token',
      characters: 'նիշ',
      ratio: 'նիշ / token',
      showIds: 'ցույց տալ ID-ները',
      loading: 'Բառարանը բեռնվում է…',
    },
    sampling: {
      title: 'Գուշակել հաջորդ բառը',
      intro:
        'Ամեն քայլում մոդելը յուրաքանչյուր հնարավոր հաջորդ բառին տալիս է <strong>հավանականություն</strong>, հետո ընտրում է մեկը՝ մոտավորապես ինչպես զառ նետելիս, երբ որոշ կողմերն ավելի հաճախ են ընկնում։ Ավելացնում է այդ բառը և կրկնում։ Սեղմեք <em>Sample</em>՝ զառը նետելու համար։',
      notes: [
        '<strong>Ցածր temperature</strong> = անվտանգ և կանխատեսելի (միշտ ֆավորիտը)։ <strong>Բարձր temperature</strong> = ավելի ստեղծագործ և պատահական։',
        '<strong>top-p</strong>-ն զառը նետելուց առաջ հեռացնում է քիչ հավանական տարբերակները, որպեսզի պատասխանը չշեղվի։',
        'Այստեղի թվերը հորինված են demo-ի համար։ Իրական մոդելն ամեն քայլում գնահատում է բոլոր մոտ 200 000 token-ները։',
      ],
      barsAria: 'Հաջորդ token-ի հավանականությունները',
    },
    attention: {
      title: 'Attention. որ բառերն են կարևոր',
      intro:
        'Բառը հասկանալու համար մոդելը նայում է նախորդ բառերին և որոշում, թե որոնք են ամենակարևորը։ Սա է <strong>attention</strong>-ը։ <strong>Մկնիկը պահեք բառի վրա</strong>՝ տեսնելու, թե ուր է այն նայում։ Որքան հաստ է գիծը, այնքան կարևոր է կապը։',
      notes: [
        'Փորձեք <strong>«it»</strong>-ը. խոսքը bug-ի՞, թե build-ի մասին է։ Attention-ի շնորհիվ է մոդելը դա հասկանում։',
        'Բառերը կարող են նայել միայն <em>հետ</em>, երբեք՝ առաջ, որովհետև մոդելը գրում է բառ առ բառ։',
        'Իրական մոդելները սա անում են միաժամանակ շատ շերտերում, և ամեն շերտ նկատում է տարբեր բաներ (քերականություն, իմաստ, դիրք)։',
      ],
      sentenceAria: 'Նախադասության token-ները',
      readout: 'Ընտրեք բառ՝ տեսնելու, թե ուր է այն նայում։',
    },
    training: {
      title: 'Ինչպես է մոդելը դառնում ChatGPT',
      intro:
        'Օգնականը կառուցվում է փուլերով։ Առաջին փուլը նրան գիտելիք է տալիս, իսկ հաջորդները սովորեցնում են՝ ինչպես իրեն պահել։',
      notes: [
        'Այն, ինչ մոդելը «գիտի», կանգ է առնում 01 փուլի ամսաթվին։ Ավելի նոր տեղեկության համար նրան պետք է web search։',
        'Նրա բնավորությունը (տոն, քաղաքավարություն, ձևավորում) հիմնականում գալիս է 02 և 03 փուլերից։',
      ],
      stages: [
        [
          'Pre-training',
          'Կարդում է ինտերնետի, գրքերի և կոդի հսկայական մասը՝ նորից ու նորից գուշակելով հաջորդ բառը։ Արդյունքը. մոդել, որը շատ բան գիտի, բայց պարզապես անվերջ խոսում է։',
          'ամիսներ · հազարավոր GPU-ներ',
        ],
        [
          'Սովորել օրինակներից',
          'Ուսումնասիրում է մարդկանց գրած հազարավոր լավ զրույցներ, որպեսզի սովորի իրեն պահել ինչպես օգտակար օգնական։',
          'լավ օրինակներ',
        ],
        [
          'Մարդկանց գնահատականը',
          'Մարդիկ համեմատում են պատասխանները և ընտրում ավելի լավը։ Մոդելին սովորեցնում են տալ այնպիսի պատասխաններ, որոնք մարդիկ նախընտրում են։',
          '👍 / 👎',
        ],
        [
          'Վարժություններ',
          'Լուծում է մաթեմատիկայի և ծրագրավորման խնդիրներ, որոնց պատասխանը կարելի է ստուգել, և պարգևատրվում է, երբ քայլ առ քայլ մտածելով հասնում է ճիշտ արդյունքի։',
          'ճիշտ / սխալ',
        ],
        [
          'Պրոդուկտը',
          'Հավելվածը մոդելի շուրջ. հրահանգներ, web search, memory, անվտանգության ֆիլտրեր և արագ/մտածող ռեժիմների ընտրություն։ Այս ամենը միասին «ChatGPT»-ն է։',
          'պրոդուկտը',
        ],
      ],
    },
    streaming: {
      title: 'Ինչու է տեքստը «ինքն իրեն տպվում»',
      intro:
        'Մոդելը պատասխանը ստեղծում է կտոր առ կտոր, ուստի server-ը ամեն կտոր ուղարկում է հենց այն պատրաստ լինելուն պես (<strong>Server-Sent Events</strong>-ի միջոցով)։ Էջը դրանք ավելացնում է ըստ ժամանման, դրա համար էլ թվում է, թե տեքստը ինքն իրեն է տպվում։ Սեղմեք «Ուղարկել» և հետևեք ցանցային հաղորդագրություններին աջ կողմում։',
      notes: [
        'Եթե առաջին բառերը շուտ են երևում, AI-ը արագ է <em>թվում</em>, նույնիսկ եթե ամբողջ պատասխանը ժամանակ է պահանջում։ Միշտ stream արեք։',
        'AI-ի պատասխանին վերաբերվեք օգտատիրոջ input-ի պես. <strong>sanitize արեք</strong>՝ նախքան էջում տեղադրելը։',
        'Վերևի կոդը պարզեցված է՝ միայն գաղափարը ցույց տալու համար։',
      ],
      question: 'Բացատրիր CSS specificity-ն մեկ պարբերությամբ։',
      send: 'Ուղարկել',
      stop: 'Կանգնեցնել (AbortController)',
    },
  },
  caps: {
    aria: 'ChatGPT-ի հնարավորությունները',
    howTo: 'ինչպես օգտագործել',
    howToAria: 'Ինչպես օգտագործել',
    underHood: 'ինչպես է աշխատում',
    tryIt: 'փորձեք',
    copy: 'Պատճենել',
    devTip: 'խորհուրդ',
    flowAria: 'Տվյալների հոսք',
  },
  playbook: {
    aria: 'Գործնական խորհուրդներ UI ծրագրավորողների համար',
    promptEyebrow: '4.1 · ինչից է բաղկացած prompt-ը',
    promptTitle: 'Prompt-ը առաջադրանք է',
    promptIntro:
      'AI-ը գիտի միայն այն, ինչ դուք իրեն ասում եք։ Լավ prompt-ը նման է լավ Jira ticket-ի. ով եք դուք, ինչ է պետք, ինչ կանոններ կան, ինչ ձևաչափով եք ուզում պատասխանը, և մի օրինակ։',
    apiEyebrow: '4.2 · API-ը 15 տողում',
    apiTitle: 'Ավելացնենք մեր պրոդուկտներում',
    apiIntro:
      'OpenAI API-ի միջոցով կարող ենք ChatGPT-ի նման հնարավորություններ ավելացնել մեր պրոդուկտներում։ Կանչեք այն backend-ից (API key-ը երբեք մի դրեք browser-ում), stream արեք պատասխանը UI-ին և խնդրեք <strong>JSON՝ որոշակի կառուցվածքով</strong>, երբ ուզում եք արդյունքը ցույց տալ component-ներով։',
    streamLabel: '1 · stream անել պատասխանը (backend)',
    structuredLabel: '2 · screenshot՝ ներս, typed JSON՝ դուրս',
    checklistEyebrow: '4.3 · սկսենք երկուշաբթիից',
    checklistTitle: 'Թիմի checklist',
  },
  future: { aria: 'Ապագայի միտումները', forUs: 'UI ծրագրավորողների համար' },
  outro: {
    eyebrow: 'շնորհակալություն',
    title: 'Հարցե՞ր',
    lead: 'Բերեք իրական task ձեր sprint-ից, և կփորձենք հենց հիմա։',
    sources: 'Աղբյուրներ',
    credits: 'Նկարների հեղինակներ',
    note: 'Տվյալները ճիշտ են 2026 թ. նոյեմբերի դրությամբ։ Պրոդուկտների մանրամասներն արագ են փոխվում, ուստի մեջբերելուց առաջ ստուգեք release notes-ը։',
  },
  zoom: 'Մեծացնել նկարը',
};

export const ui: Record<Lang, UiStrings> = { en, hy };
