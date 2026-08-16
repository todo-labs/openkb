import { generateKnowledgeBase } from '@openkb/generate';

export async function generateCommand(options: {
  init?: boolean;
  update?: boolean;
  model?: string;
  output?: string;
} = {}): Promise<void> {
  const mode = options.init ? 'init' : 'update';
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('\n❌ [OpenKB] Error: OPENROUTER_API_KEY is not set.');
    console.error('Please export your OpenRouter key to generate documentation with Gemini 3.7 Flash:');
    console.error('  export OPENROUTER_API_KEY="sk-or-v1-..."\n');
    process.exit(1);
  }

  try {
    await generateKnowledgeBase({
      rootDir: process.cwd(),
      outputDir: options.output,
      model: options.model || 'google/gemini-2.5-flash',
      mode,
      apiKey,
    });
  } catch (err: any) {
    console.error('\n❌ [OpenKB] AI doc synthesis failed:', err.message || err);
    process.exit(1);
  }
}
