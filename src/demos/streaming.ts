import { qs } from '../core/dom';
import { rt } from '../i18n/runtime';

/** Rough word-piece split that mimics token-sized deltas. */
const toDeltas = (text: string): string[] => text.match(/\s*[^\s]{1,6}/g) ?? [];

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(id);
        reject(signal.reason as Error);
      },
      { once: true },
    );
  });

/**
 * Simulates a Responses-API SSE stream: same event names and payload shapes as the real wire format,
 * generated locally so the demo works offline and without an API key.
 */
async function* fakeStream(signal: AbortSignal): AsyncGenerator<{ event: string; data: object }> {
  yield {
    event: 'response.created',
    data: { type: 'response.created', response: { id: 'resp_demo', status: 'in_progress' } },
  };
  await sleep(380, signal); // time to first token
  let outputTokens = 0;
  for (const delta of toDeltas(rt().streamAnswer)) {
    outputTokens++;
    yield {
      event: 'response.output_text.delta',
      data: { type: 'response.output_text.delta', delta },
    };
    await sleep(28 + Math.random() * 40, signal);
  }
  yield {
    event: 'response.completed',
    data: {
      type: 'response.completed',
      response: { status: 'completed', usage: { input_tokens: 14, output_tokens: outputTokens } },
    },
  };
}

export const initStreaming = (root: HTMLElement): void => {
  const output = qs('[data-stream-output]', root);
  const log = qs('[data-stream-log]', root);
  const start = qs<HTMLButtonElement>('[data-stream-start]', root);
  const abort = qs<HTMLButtonElement>('[data-stream-abort]', root);
  let controller: AbortController | null = null;

  const logLine = (event: string, data: object): void => {
    const li = document.createElement('li');
    li.className = 'stream__line';
    li.innerHTML = `<span class="stream__event">event: ${event}</span>`;
    const payload = document.createElement('span');
    payload.className = 'stream__data';
    payload.textContent = `data: ${JSON.stringify(data)}`;
    li.append(payload);
    log.append(li);
    if (log.children.length > 60) log.firstElementChild?.remove();
    log.scrollTop = log.scrollHeight;
  };

  const run = async (): Promise<void> => {
    controller = new AbortController();
    output.textContent = '';
    log.replaceChildren();
    root.classList.add('is-streaming');
    start.disabled = true;
    abort.disabled = false;
    try {
      for await (const { event, data } of fakeStream(controller.signal)) {
        logLine(event, data);
        if ('delta' in data && typeof data.delta === 'string') output.append(data.delta);
      }
    } catch {
      logLine('abort', { reason: 'AbortController.abort() — connection closed by client' });
      output.append(' ⏹');
    } finally {
      root.classList.remove('is-streaming');
      start.disabled = false;
      abort.disabled = true;
      controller = null;
    }
  };

  start.addEventListener('click', () => void run());
  abort.addEventListener('click', () =>
    controller?.abort(new DOMException('Aborted', 'AbortError')),
  );
};
