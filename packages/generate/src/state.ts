import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export interface OpenKBState {
  lastUpdated: string;
  gitCommitSha?: string;
  generatedConcepts: string[];
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

export function saveState(outputDir: string, generatedConcepts: string[]): void {
  let gitCommitSha: string | undefined;
  try {
    gitCommitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {}

  const state: OpenKBState = {
    lastUpdated: new Date().toISOString(),
    gitCommitSha,
    generatedConcepts,
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
