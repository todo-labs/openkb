import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import type { DiscoveredConcept } from './opencode.js';

export interface OpenKBState {
  lastUpdated: string;
  gitCommitSha?: string;
  generatedConcepts: string[];
  concepts?: DiscoveredConcept[];
}

export function getStateFilePath(outputDir: string): string {
  return path.join(outputDir, '.last-update.json');
}

export function loadState(outputDir: string): OpenKBState | null {
  const filePath = getStateFilePath(outputDir);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {}
  }
  return null;
}

export function changedFilesSince(rootDir: string, commitSha?: string): string[] | null {
  if (!commitSha) return null;

  try {
    return execSync(`git diff --name-only ${commitSha}...HEAD`, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .split('\n')
      .map((file) => file.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

export function saveState(outputDir: string, generatedConcepts: string[], concepts: DiscoveredConcept[]): void {
  let gitCommitSha: string | undefined;
  try {
    gitCommitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {}

  const state: OpenKBState = {
    lastUpdated: new Date().toISOString(),
    gitCommitSha,
    generatedConcepts,
    concepts,
  };

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    getStateFilePath(outputDir),
    JSON.stringify(state, null, 2),
    'utf-8'
  );
}
