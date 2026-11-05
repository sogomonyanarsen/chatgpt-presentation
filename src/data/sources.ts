import type { Credit, Source } from './types';

/** Image attributions (all from Wikimedia Commons, used under their stated licenses). */
export const credits: Record<string, Credit> = {
  transformer: {
    title: 'Transformer, full architecture',
    author: 'dvgodoy',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Transformer,_full_architecture.png',
  },
  altman2019: {
    title: 'Sam Altman, TechCrunch SF 2019',
    author: 'TechCrunch',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_(cropped).jpg',
  },
  chatgptScreenshot: {
    title: 'ChatGPT response screenshot',
    author: 'Abdallah zeadnh',
    license: 'Public domain',
    url: 'https://commons.wikimedia.org/wiki/File:ChatGPT_response_screenshot_1.jpg',
  },
  altman2022: {
    title: 'Sam Altman, November 2022',
    author: 'Village Global',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Sam_Altman_November_2022.jpg',
  },
  h100: {
    title: 'NVIDIA H100',
    author: '极客湾 Geekerwan',
    license: 'CC BY 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:NVIDIA_H100_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_002.png',
  },
  tau2023: {
    title: 'Ilya Sutskever and Sam Altman in TAU',
    author: 'Eladkarmel',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Ilya_Sutskever_and_Sam_Altman_in_TAU.jpg',
  },
  whisper: {
    title: 'OpenAI Whisper architecture',
    author: 'Radford et al. (OpenAI)',
    license: 'MIT',
    url: 'https://commons.wikimedia.org/wiki/File:OpenAI_Whisper_architecture.png',
  },
  sticker: {
    title: 'Person holding the OpenAI icon',
    author: 'FoxTPNL',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Person_holding_the_OpenAI_icon.jpg',
  },
};

export const sources: Source[] = [
  {
    label: 'Vaswani et al. — Attention Is All You Need (2017)',
    url: 'https://arxiv.org/abs/1706.03762',
  },
  {
    label: 'Radford et al. — Improving Language Understanding by Generative Pre-Training (GPT-1)',
    url: 'https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf',
  },
  {
    label: 'OpenAI — Better language models and their implications (GPT-2)',
    url: 'https://openai.com/index/better-language-models/',
  },
  {
    label: 'Brown et al. — Language Models are Few-Shot Learners (GPT-3)',
    url: 'https://arxiv.org/abs/2005.14165',
  },
  {
    label: 'Ouyang et al. — Training language models to follow instructions with human feedback',
    url: 'https://arxiv.org/abs/2203.02155',
  },
  { label: 'OpenAI — Introducing ChatGPT', url: 'https://openai.com/index/chatgpt/' },
  { label: 'OpenAI — GPT-4 Technical Report', url: 'https://arxiv.org/abs/2303.08774' },
  { label: 'OpenAI — Hello GPT-4o', url: 'https://openai.com/index/hello-gpt-4o/' },
  {
    label: 'OpenAI — Learning to reason with LLMs (o1)',
    url: 'https://openai.com/index/learning-to-reason-with-llms/',
  },
  { label: 'OpenAI — Introducing GPT-5', url: 'https://openai.com/index/introducing-gpt-5/' },
  {
    label: 'OpenAI — ChatGPT release notes',
    url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
  },
  {
    label: 'OpenAI Developers — Plugins (MCP + UI) docs',
    url: 'https://developers.openai.com/plugins',
  },
  {
    label: 'OpenAI Developers — Returning UI from MCP tools',
    url: 'https://developers.openai.com/plugins/build/chatgpt-ui',
  },
  { label: 'OpenAI — GPT-6 for everyone', url: 'https://openai.com/index/gpt-6-for-everyone/' },
  {
    label: 'TechCrunch — OpenAI releases GPT-5.5 (Apr 2026)',
    url: 'https://techcrunch.com/2026/04/23/openai-chatgpt-gpt-5-5-ai-model-superapp/',
  },
  {
    label: 'TechCrunch — ChatGPT is getting a lot more visual (Oct 2026)',
    url: 'https://techcrunch.com/2026/10/07/chatgpt-is-getting-a-lot-more-visual-with-the-launch-of-a-new-interface/',
  },
  {
    label: 'Wikipedia — ChatGPT (timeline & usage figures)',
    url: 'https://en.wikipedia.org/wiki/ChatGPT',
  },
  { label: 'Wikipedia — GPT-6', url: 'https://en.wikipedia.org/wiki/GPT-6' },
  { label: 'Model Context Protocol — specification', url: 'https://modelcontextprotocol.io' },
  {
    label: 'gpt-tokenizer (o200k_base) — used by the live tokenizer demo',
    url: 'https://github.com/niieani/gpt-tokenizer',
  },
];
