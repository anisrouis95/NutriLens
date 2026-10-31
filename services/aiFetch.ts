// A fetch with a time limit for AI requests. Some free models never answer
// (they queue the request instead of saying "busy"), so without a limit a meal
// scan could spin forever; with it, the app moves on to the next model.

export class AiTimeout extends Error {
  constructor() {
    super('No answer in time');
    this.name = 'AiTimeout';
  }
}

/** Text answers come in seconds; a photo takes longer to read. */
export const TEXT_TIMEOUT = 20_000;
export const IMAGE_TIMEOUT = 35_000;

export async function timedFetch(url: string, init: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    // The body is read inside the limit too: a model can stall mid-answer.
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    return new Response(text, { status: res.status, statusText: res.statusText, headers: res.headers });
  } catch (e) {
    if (controller.signal.aborted) throw new AiTimeout();
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Whether a request carries a photo (it gets the longer limit). */
export const hasImagePart = (contents: { parts: object[] }[]) => contents.some((c) => c.parts.some((p) => 'inlineData' in p));
