import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { OkfFrontmatterSchema } from './schema.js';

/**
 * Reject drafts that cannot be traced back to files the agent actually had
 * access to. This keeps generated OKF documents from presenting invented
 * provenance as fact.
 */
export function validateGeneratedOkf(document: string, rootDir: string): string {
  const match = document.trim().match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]+)/);
  if (!match) {
    throw new Error('Generated output must start with YAML OKF frontmatter.');
  }

  const parsed = OkfFrontmatterSchema.safeParse(yaml.load(match[1]));
  if (!parsed.success) {
    throw new Error(`Generated OKF frontmatter is invalid: ${parsed.error.message}`);
  }

  const frontmatter = parsed.data;
  if (!frontmatter.title || !frontmatter.description) {
    throw new Error('Generated OKF frontmatter must include title and description.');
  }
  if (frontmatter.sources.length === 0) {
    throw new Error('Generated OKF frontmatter must cite at least one repository source.');
  }

  for (const source of frontmatter.sources) {
    const sourcePath = path.resolve(rootDir, source.uri);
    const isInsideRepository = sourcePath === rootDir || sourcePath.startsWith(`${rootDir}${path.sep}`);
    if (!isInsideRepository || !fs.existsSync(sourcePath)) {
      throw new Error(`Generated OKF source does not exist in this repository: ${source.uri}`);
    }
  }

  return document.trim().concat('\n');
}
