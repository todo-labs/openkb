import fs from 'node:fs';
import path from 'node:path';

const OPENKB_START_TAG = '<!-- OPENKB:START -->';
const OPENKB_END_TAG = '<!-- OPENKB:END -->';

export function getPointerBlock(docsDir = 'content'): string {
  return `${OPENKB_START_TAG}
## Living Codebase Knowledge (OpenKB)
This repository maintains living documentation powered by OpenKB (Google OKF v0.2 format).
Before making architectural decisions, consult the concept documents in \`${docsDir}/\`:
- **Index**: \`${docsDir}/index.mdx\`
- **Knowledge Catalog**: \`${docsDir}/\`
- **Agent Sitemap**: \`/llms.txt\`
${OPENKB_END_TAG}`;
}

export function injectAgentPointers(rootDir: string = process.cwd(), docsDir = 'content'): void {
  const targetFiles = ['AGENTS.md', 'CLAUDE.md'];

  for (const filename of targetFiles) {
    const filePath = path.join(rootDir, filename);
    const pointerContent = getPointerBlock(docsDir);

    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, 'utf-8');
      if (existing.includes(OPENKB_START_TAG) && existing.includes(OPENKB_END_TAG)) {
        const regex = new RegExp(`${OPENKB_START_TAG}[\\s\\S]*?${OPENKB_END_TAG}`, 'g');
        const updated = existing.replace(regex, pointerContent);
        fs.writeFileSync(filePath, updated, 'utf-8');
      } else {
        fs.writeFileSync(filePath, `${existing.trim()}\n\n${pointerContent}\n`, 'utf-8');
      }
    } else {
      fs.writeFileSync(filePath, `# Coding Agent Guidelines\n\n${pointerContent}\n`, 'utf-8');
    }
  }
}
