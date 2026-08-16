import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export interface CodebaseContext {
  fileTree: string[];
  primaryFiles: { path: string; content: string }[];
  gitLogSummary: string;
  packageInfo?: Record<string, any>;
}

const IGNORE_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.turbo',
  '.astro',
  '.next',
  'coverage',
  '.DS_Store',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'bun.lockb',
]);

function shouldIgnore(name: string): boolean {
  if (IGNORE_NAMES.has(name)) return true;
  if (name.endsWith('.lock') || name.endsWith('.log')) return true;
  if (name.startsWith('.') && name !== '.env.example') return true;
  return false;
}

export function walkDirectory(dir: string, baseDir: string = dir, depth = 0, maxDepth = 4): string[] {
  if (depth > maxDepth) return [];
  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        results.push(`${relativePath}/`);
        results.push(...walkDirectory(fullPath, baseDir, depth + 1, maxDepth));
      } else {
        results.push(relativePath);
      }
    }
  } catch (err) {
    // Ignore unreadable directories
  }

  return results;
}

export function scanCodebase(rootDir: string = process.cwd()): CodebaseContext {
  const fileTree = walkDirectory(rootDir);

  // Read package.json if present
  let packageInfo: Record<string, any> | undefined;
  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      packageInfo = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    } catch {}
  }

  // Pick primary files (README, entry files, configs)
  const priorityFiles = [
    'README.md',
    'src/index.ts',
    'src/index.js',
    'src/main.ts',
    'src/main.rs',
    'src/main.py',
    'src/app.ts',
    'docs.json',
  ];

  const primaryFiles: { path: string; content: string }[] = [];
  for (const relPath of priorityFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Cap content at 4000 chars per file to avoid context bloat
        primaryFiles.push({
          path: relPath,
          content: content.slice(0, 4000),
        });
      } catch {}
    }
  }

  // Get recent git commits summary if inside a git repo
  let gitLogSummary = '';
  try {
    gitLogSummary = execSync('git log -n 10 --pretty=format:"%h - %an: %s (%cr)"', {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    gitLogSummary = 'Git history unavailable.';
  }

  return {
    fileTree,
    primaryFiles,
    gitLogSummary,
    packageInfo,
  };
}
