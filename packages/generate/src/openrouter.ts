export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenRouterClient {
  private apiKey: string;
  private model: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(options: OpenRouterOptions = {}) {
    this.apiKey =
      options.apiKey ||
      process.env.OPENROUTER_API_KEY ||
      process.env.GEMINI_API_KEY ||
      '';
    this.model =
      options.model ||
      process.env.OPENKB_MODEL ||
      'google/gemini-2.5-flash';
  }

  async generate(messages: OpenRouterMessage[], temperature = 0.2): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        '[OpenKB] Error: Missing OPENROUTER_API_KEY. Please set the OPENROUTER_API_KEY environment variable.'
      );
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://github.com/todo-labs/openkb',
        'X-Title': 'OpenKB Documentation Engine',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[OpenKB] OpenRouter API call failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
