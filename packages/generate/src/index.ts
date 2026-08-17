import fs from 'node:fs';
import path from 'node:path';
import { discoverConceptsWithOpenCode, synthesizeWithOpenCode } from './opencode.js';
import { injectAgentPointers } from './agent-pointers.js';
import { changedFilesSince, loadState, saveState } from './state.js';
import { updateGeneratedNavigation } from './navigation.js';
import { validateGeneratedOkf } from './validation.js';

export interface GenerateOptions {
  rootDir?: string;
  outputDir?: string;
  mode?: 'init' | 'update';
}

export async function generateKnowledgeBase(options: GenerateOptions = {}): Promise<void> {
  const rootDir = options.rootDir || process.cwd();
  const outputDir = options.outputDir || path.join(rootDir, 'content');
  console.log(`\n🔎 [OpenKB] Starting a read-only OpenCode research session in: ${rootDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const previousState = loadState(outputDir);
  const changedFiles = options.mode === 'update' ? changedFilesSince(rootDir, previousState?.gitCommitSha) : null;
  if (options.mode === 'update' && changedFiles?.length === 0) {
    console.log('✨ [OpenKB] No committed repository changes since the previous generation; documentation is current.');
    return;
  }

  console.log('🗺️  [OpenKB] Discovering the repository’s complete concept inventory via OpenCode...');
  const conceptsToGenerate = await discoverConceptsWithOpenCode(rootDir);
  const previousConcepts = new Map(previousState?.concepts?.map((concept) => [concept.slug, concept]) ?? []);
  const conceptsToRefresh = changedFiles && previousState?.concepts
    ? conceptsToGenerate.filter((concept) => {
        const previous = previousConcepts.get(concept.slug);
        return !previous || previous.sources.some((source) => changedFiles.includes(source));
      })
    : conceptsToGenerate;
  console.log(`🤖 [OpenKB] Synthesizing ${conceptsToRefresh.length} evidence-backed OKF v0.2 concept documents via OpenCode...`);

  const generatedFiles: string[] = [];

  for (const concept of conceptsToRefresh) {
    console.log(`   ⏳ Synthesizing "${concept.title}" (${concept.type})...`);
    
    try {
      const response = await synthesizeWithOpenCode({ rootDir, title: concept.title, type: concept.type, description: concept.description, suggestedSources: concept.sources });

      const targetPath = path.join(outputDir, `${concept.slug}.mdx`);
      fs.writeFileSync(targetPath, validateGeneratedOkf(response, rootDir), 'utf-8');
      generatedFiles.push(concept.slug);
      console.log(`   ✅ Saved: ${targetPath}`);
    } catch (err: any) {
      console.error(`   ❌ Failed to generate ${concept.slug}:`, err?.message || err);
    }
  }

  console.log('📌 [OpenKB] Updating coding agent pointers in AGENTS.md and CLAUDE.md...');
  injectAgentPointers(rootDir, path.relative(rootDir, outputDir) || 'content');

  const knownGeneratedFiles = options.mode === 'update'
    ? [...new Set([...(previousState?.generatedConcepts ?? []), ...generatedFiles])]
    : generatedFiles;
  updateGeneratedNavigation(rootDir, outputDir, knownGeneratedFiles);
  saveState(outputDir, knownGeneratedFiles, conceptsToGenerate);
  console.log('✨ [OpenKB] Codebase knowledge synthesis complete!\n');
}

export * from './scanner.js';
export * from './prompts.js';
export * from './agent-pointers.js';
export * from './state.js';
export * from './schema.js';
export * from './opencode.js';
export * from './validation.js';
export * from './navigation.js';
