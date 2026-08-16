import fs from 'node:fs';
import path from 'node:path';
import { scanCodebase } from './scanner.js';
import { OpenRouterClient } from './openrouter.js';
import { buildSystemPrompt, buildConceptGenerationPrompt } from './prompts.js';
import { synthesizeWithOpenCode } from './opencode.js';
import { injectAgentPointers } from './agent-pointers.js';
import { saveState } from './state.js';
import { validateGeneratedOkf } from './validation.js';

export type GenerateProvider = 'openrouter' | 'opencode';

export interface GenerateOptions {
  rootDir?: string;
  outputDir?: string;
  apiKey?: string;
  model?: string;
  provider?: GenerateProvider;
  mode?: 'init' | 'update';
}

export async function generateKnowledgeBase(options: GenerateOptions = {}): Promise<void> {
  const rootDir = options.rootDir || process.cwd();
  const outputDir = options.outputDir || path.join(rootDir, 'content');
  const provider = options.provider || 'openrouter';
  const client = provider === 'openrouter'
    ? new OpenRouterClient({
        apiKey: options.apiKey,
        model: options.model || 'google/gemini-2.5-flash',
      })
    : undefined;

  const context = provider === 'openrouter' ? scanCodebase(rootDir) : undefined;
  console.log(provider === 'opencode'
    ? `\n🔎 [OpenKB] Starting a read-only OpenCode research session in: ${rootDir}`
    : `\n🔍 [OpenKB] Scanning codebase in: ${rootDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const conceptsToGenerate = [
    { name: 'architecture', title: 'Architecture Overview', type: 'Architecture' },
    { name: 'quickstart', title: 'Quickstart Guide', type: 'Workflow' },
    { name: 'modules', title: 'Core Modules & Services', type: 'Module' },
  ];

  console.log(`🤖 [OpenKB] Synthesizing ${conceptsToGenerate.length} evidence-backed OKF v0.2 concept documents via ${provider}...`);

  const generatedFiles: string[] = [];

  for (const concept of conceptsToGenerate) {
    console.log(`   ⏳ Synthesizing "${concept.title}" (${concept.type})...`);
    
    try {
      const response = provider === 'opencode'
        ? await synthesizeWithOpenCode({
            rootDir,
            title: concept.title,
            type: concept.type,
            model: options.model,
          })
        : await client!.generate([
            { role: 'system', content: buildSystemPrompt('openkb/openrouter') },
            {
              role: 'user',
              content: buildConceptGenerationPrompt(concept.title, concept.type, context!),
            },
          ]);

      const targetPath = path.join(outputDir, `${concept.name}.mdx`);
      fs.writeFileSync(targetPath, validateGeneratedOkf(response, rootDir), 'utf-8');
      generatedFiles.push(concept.name);
      console.log(`   ✅ Saved: ${targetPath}`);
    } catch (err: any) {
      console.error(`   ❌ Failed to generate ${concept.name}:`, err?.message || err);
    }
  }

  console.log('📌 [OpenKB] Updating coding agent pointers in AGENTS.md and CLAUDE.md...');
  injectAgentPointers(rootDir, path.relative(rootDir, outputDir) || 'content');

  saveState(outputDir, generatedFiles);
  console.log('✨ [OpenKB] Codebase knowledge synthesis complete!\n');
}

export * from './openrouter.js';
export * from './scanner.js';
export * from './prompts.js';
export * from './agent-pointers.js';
export * from './state.js';
export * from './schema.js';
export * from './opencode.js';
export * from './validation.js';
