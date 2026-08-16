import { createOpencode } from '@opencode-ai/sdk';
import type { Part } from '@opencode-ai/sdk';
import { buildAgenticConceptPrompt, buildConceptInventoryPrompt } from './prompts.js';

/** OpenKB's fixed cost-efficient model for repository research and synthesis. */
const OPENKB_MODEL = 'openrouter/deepseek/deepseek-v4-flash';

export interface OpenCodeSynthesisOptions {
  rootDir: string;
  title: string;
  type: string;
  description: string;
  suggestedSources: string[];
}

export interface DiscoveredConcept {
  slug: string;
  title: string;
  type: string;
  description: string;
  sources: string[];
}

function textFrom(parts: Part[]): string {
  return parts
    .filter((part): part is Extract<Part, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

function assertOpenRouterKey(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('Missing OPENROUTER_API_KEY. OpenKB uses OpenRouter for model access.');
  }
}

async function createReadOnlyOpenCode() {
  return createOpencode({
    config: {
      // OpenCode supplies the agent loop and tools; OpenRouter is the sole model provider.
      enabled_providers: ['openrouter'],
      model: OPENKB_MODEL,
      provider: {
        openrouter: {
          options: { apiKey: '{env:OPENROUTER_API_KEY}' },
        },
      },
      agent: {
        'openkb-planner': {
          mode: 'primary',
          model: OPENKB_MODEL,
          description: 'Read-only repository mapping for an OpenKB documentation inventory.',
          maxSteps: 24,
          tools: { task: false },
          permission: { edit: 'deny', bash: 'deny', webfetch: 'deny', external_directory: 'deny' },
        },
        'openkb-docs': {
          mode: 'primary',
          model: OPENKB_MODEL,
          description: 'Read-only, focused, evidence-backed OpenKB documentation synthesis.',
          maxSteps: 16,
          tools: { task: false },
          permission: { edit: 'deny', bash: 'deny', webfetch: 'deny', external_directory: 'deny' },
        },
      },
    },
  });
}

function parseConceptInventory(response: string): DiscoveredConcept[] {
  const trimmed = response.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('OpenCode did not return a JSON concept inventory.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    throw new Error('OpenCode returned an invalid JSON concept inventory.');
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('OpenCode found no documentable concepts in this repository.');
  }

  const seen = new Set<string>();
  return parsed.map((value, index) => {
    if (!value || typeof value !== 'object') throw new Error(`Concept ${index + 1} is not an object.`);
    const concept = value as Record<string, unknown>;
    const slug = typeof concept.slug === 'string' ? concept.slug.trim() : '';
    const title = typeof concept.title === 'string' ? concept.title.trim() : '';
    const type = typeof concept.type === 'string' ? concept.type.trim() : '';
    const description = typeof concept.description === 'string' ? concept.description.trim() : '';
    const sources = Array.isArray(concept.sources)
      ? concept.sources.filter((source): source is string => typeof source === 'string' && source.trim().length > 0)
      : [];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !type || !description || sources.length === 0) {
      throw new Error(`Concept ${index + 1} is incomplete or has an invalid slug.`);
    }
    if (seen.has(slug)) throw new Error(`OpenCode returned duplicate concept slug: ${slug}`);
    seen.add(slug);
    return { slug, title, type, description, sources };
  });
}

/** Maps the entire repository into a dynamic, non-hardcoded documentation inventory. */
export async function discoverConceptsWithOpenCode(rootDir: string): Promise<DiscoveredConcept[]> {
  assertOpenRouterKey();
  const { client, server } = await createReadOnlyOpenCode();
  try {
    const session = await client.session.create({ query: { directory: rootDir }, body: { title: 'OpenKB: repository map' } });
    if (!session.data) throw new Error('OpenCode could not create a repository mapping session.');
    const response = await client.session.prompt({
      path: { id: session.data.id },
      query: { directory: rootDir },
      body: { agent: 'openkb-planner', tools: { task: false }, parts: [{ type: 'text', text: buildConceptInventoryPrompt() }] },
    });
    if (response.error) throw new Error(`OpenCode repository mapping failed: ${JSON.stringify(response.error)}`);
    return parseConceptInventory(response.data ? textFrom(response.data.parts) : '');
  } finally {
    server.close();
  }
}

/**
 * Runs a read-only OpenCode session. OpenCode supplies the file and search
 * tools; the configured agent is expressly prevented from modifying the
 * repository or invoking a shell.
 */
export async function synthesizeWithOpenCode(options: OpenCodeSynthesisOptions): Promise<string> {
  assertOpenRouterKey();
  const { client, server } = await createReadOnlyOpenCode();

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
        tools: { task: false },
        parts: [{ type: 'text', text: buildAgenticConceptPrompt(options.title, options.type, options.description, options.suggestedSources) }],
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
