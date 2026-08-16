#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { validateCommand } from './commands/validate.js';
import { generateCommand } from './commands/generate.js';

// Auto-load .env file if present
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile(envPath);
    } else {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const value = rest.join('=').replace(/^["'](.*)["']$/, '$1');
          if (key && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
          }
        }
      }
    }
  } catch {}
}

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
  .description('Synthesize living OKF documentation from your codebase')
  .option('--init', 'Run initial full codebase synthesis')
  .option('--update', 'Refresh existing generated documents with fresh repository research')
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
