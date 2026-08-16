import { createOpencode } from '@opencode-ai/sdk';
import type { Part } from '@opencode-ai/sdk';
import { buildAgenticConceptPrompt } from './prompts.js';

export interface OpenCodeSynthesisOptions {
  rootDir: string;
  title: string;
  type: string;
  model?: string;
}

function parseModel(model?: string): { providerID: string; modelID: string } | undefined {
  if (!model) return undefined;
  const separator = model.indexOf('/');
  if (separator <= 0 || separator === model.length - 1) {
    throw new Error('OpenCode models must use the provider/model format.');
  }
  return { providerID: model.slice(0, separator), modelID: model.slice(separator + 1) };
}

function textFrom(parts: Part[]): string {
  return parts
    .filter((part): part is Extract<Part, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

/**
 * Runs a read-only OpenCode session. OpenCode supplies the file and search
 * tools; the configured agent is expressly prevented from modifying the
 * repository or invoking a shell.
 */
export async function synthesizeWithOpenCode(options: OpenCodeSynthesisOptions): Promise<string> {
  const model = parseModel(options.model);
  const { client, server } = await createOpencode({
    config: {
      ...(options.model ? { model: options.model } : {}),
      agent: {
        'openkb-docs': {
          mode: 'primary',
          description: 'Read-only repository research and evidence-backed OpenKB documentation.',
          maxSteps: 40,
          permission: {
            edit: 'deny',
            bash: 'deny',
            webfetch: 'deny',
            external_directory: 'deny',
          },
        },
      },
    },
  });

  try {
    const session = await client.session.create({
      query: { directory: options.rootDir },
      body: { title: `OpenKB: ${options.title}` },
    });
    if (!session.data) throw new Error('OpenCode could not create a documentation session.');

    const response = await client.session.prompt({
      path: { id: session.data.id },
      query: { directory: options.rootDir },
      body: {
        agent: 'openkb-docs',
        ...(model ? { model } : {}),
        parts: [{ type: 'text', text: buildAgenticConceptPrompt(options.title, options.type) }],
      },
    });
    if (response.error) {
      throw new Error(`OpenCode synthesis failed: ${JSON.stringify(response.error)}`);
    }

    const document = response.data ? textFrom(response.data.parts) : '';
    if (!document) throw new Error('OpenCode returned no document content.');
    return document;
  } finally {
    server.close();
  }
}
