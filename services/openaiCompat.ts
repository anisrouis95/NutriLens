// Shared by the providers that speak the OpenAI chat format (Groq, OpenRouter):
// turning the app's request into chat messages, and reading the reply.

import type { GenerateOptions } from '@/services/aiTypes';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[];
};

export function toMessages(opts: GenerateOptions): { messages: ChatMessage[]; hasImage: boolean } {
  let hasImage = false;
  let system = opts.system ?? '';
  if (opts.responseSchema) {
    // Many of these models have no structured output, so the schema goes in the prompt.
    system += `\n\nReply with ONE JSON object only (no prose, no code fences) that matches this schema:\n${JSON.stringify(opts.responseSchema)}`;
  }
  const messages: ChatMessage[] = system ? [{ role: 'system', content: system.trim() }] : [];
  for (const c of opts.contents) {
    const parts = c.parts.map((p) => {
      if ('text' in p) return { type: 'text' as const, text: p.text };
      hasImage = true;
      return { type: 'image_url' as const, image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } };
    });
    messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: parts });
  }
  return { messages, hasImage };
}

/** The reply text of a chat completion body, or '' (with the provider's error message if it sent one). */
export function readChat(body: string): { text: string; error?: string } {
  try {
    const json = JSON.parse(body);
    if (json?.error) return { text: '', error: String(json.error.message ?? json.error).slice(0, 200) };
    const content = json?.choices?.[0]?.message?.content;
    const text =
      typeof content === 'string' ? content : Array.isArray(content) ? content.map((c: { text?: string }) => c.text ?? '').join('') : '';
    return { text: text.trim() };
  } catch {
    return { text: '' };
  }
}
