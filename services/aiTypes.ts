// Shared by the AI providers (Gemini, OpenRouter) so neither imports the other.

export type GeminiErrorCode =
  | 'no_key'
  | 'invalid_key'
  | 'quota'
  | 'network'
  | 'blocked'
  | 'data_policy'
  | 'bad_response'
  | 'server';

/** The app's AI error (named for the first provider; used for every provider). */
export class GeminiError extends Error {
  constructor(
    public code: GeminiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export interface GeminiContent {
  role: 'user' | 'model';
  parts: Part[];
}

export interface GenerateOptions {
  system?: string;
  contents: GeminiContent[];
  /** OpenAPI-style schema; when set the reply is parsed as JSON. */
  responseSchema?: Record<string, unknown>;
  temperature?: number;
}
