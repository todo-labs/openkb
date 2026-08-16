#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { validateCommand } from './commands/validate.js';
import { generateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('openkb')
  .description('OpenKB: AI-Native Open-Source Documentation Engine')
  .version('0.1.0');

program
  .command('init [dir]')
  .description('Initialize a new OpenKB documentation project')
  .action(async (dir) => {
    try {
      await initCommand(dir || '.');
    } catch (err: any) {
      console.error('❌ [OpenKB] Init failed:', err?.message || err);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start the local development server with hot-module reloading')
  .option('-p, --port <port>', 'Custom port to run on', '3000')
  .action(async (options) => {
    try {
      await devCommand(options);
    } catch (err: any) {
      console.error('❌ [OpenKB] Dev server failed:', err?.message || err);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build a 100% static documentation site to dist/')
  .action(async () => {
    try {
      await buildCommand();
    } catch (err: any) {
      console.error('❌ [OpenKB] Build failed:', err?.message || err);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate docs.json configuration and Google OKF v0.2 frontmatter')
  .action(async () => {
    try {
      await validateCommand();
    } catch (err: any) {
      console.error('❌ [OpenKB] Validation failed:', err?.message || err);
      process.exit(1);
    }
  });

program
  .command('generate')
  .description('Synthesize living OKF documentation from your codebase using Gemini 3.7 Flash')
  .option('--init', 'Run initial full codebase synthesis')
  .option('--update', 'Run incremental synthesis on changed files')
  .option('--model <model>', 'OpenRouter model ID to use', 'google/gemini-2.5-flash')
  .option('-o, --output <dir>', 'Target output directory for OKF files')
  .action(async (options) => {
    try {
      await generateCommand(options);
    } catch (err: any) {
      console.error('❌ [OpenKB] Generation failed:', err?.message || err);
      process.exit(1);
    }
  });

await program.parseAsync(process.argv);
