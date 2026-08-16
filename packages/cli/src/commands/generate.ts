import { generateKnowledgeBase, loadDocsConfig } from '@todo-labs/openkb-generate';

export async function generateCommand(options: {
  init?: boolean;
  update?: boolean;
  output?: string;
} = {}): Promise<void> {
  const mode = options.init ? 'init' : 'update';
  const config = loadDocsConfig();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('\n❌ [OpenKB] Error: OPENROUTER_API_KEY is not set.');
    console.error('OpenKB uses OpenCode for agentic repository research and OpenRouter for model access.');
    console.error('  export OPENROUTER_API_KEY="sk-or-v1-..."\n');
    process.exit(1);
  }

  try {
    await generateKnowledgeBase({
      rootDir: process.cwd(),
      outputDir: options.output || config.generate?.outputDir,
      mode,
    });
  } catch (err: any) {
    console.error('\n❌ [OpenKB] AI doc synthesis failed:', err.message || err);
    process.exit(1);
  }
}
