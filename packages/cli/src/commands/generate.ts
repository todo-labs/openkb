import { generateKnowledgeBase, loadDocsConfig } from '@todo-labs/openkb-generate';

export async function generateCommand(options: {
  init?: boolean;
  update?: boolean;
  model?: string;
  output?: string;
  provider?: 'openrouter' | 'opencode';
} = {}): Promise<void> {
  const mode = options.init ? 'init' : 'update';
  const config = loadDocsConfig();
  const provider = options.provider || config.generate?.provider || 'openrouter';
  const model = options.model || config.generate?.model;
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

  if (provider !== 'openrouter' && provider !== 'opencode') {
    throw new Error(`Unsupported generation provider: ${provider}. Use openrouter or opencode.`);
  }

  if (provider === 'openrouter' && !apiKey) {
    console.error('\n❌ [OpenKB] Error: OPENROUTER_API_KEY is not set.');
    console.error('Please export your OpenRouter key to generate documentation with Gemini 3.7 Flash:');
    console.error('  export OPENROUTER_API_KEY="sk-or-v1-..."\n');
    process.exit(1);
  }

  try {
    await generateKnowledgeBase({
      rootDir: process.cwd(),
      outputDir: options.output || config.generate?.outputDir,
      model,
      provider,
      mode,
      apiKey,
    });
  } catch (err: any) {
    console.error('\n❌ [OpenKB] AI doc synthesis failed:', err.message || err);
    process.exit(1);
  }
}
