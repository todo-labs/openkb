import { generateKnowledgeBase, loadDocsConfig } from '@todo-labs/openkb-generate';

export async function generateCommand(options: {
  init?: boolean;
  update?: boolean;
  model?: string;
  output?: string;
} = {}): Promise<void> {
  const mode = options.init ? 'init' : 'update';
  const config = loadDocsConfig();
  const model = options.model || config.generate?.model;

  try {
    await generateKnowledgeBase({
      rootDir: process.cwd(),
      outputDir: options.output || config.generate?.outputDir,
      model,
      mode,
    });
  } catch (err: any) {
    console.error('\n❌ [OpenKB] AI doc synthesis failed:', err.message || err);
    process.exit(1);
  }
}
