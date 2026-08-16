import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { DocsConfigSchema, OkfFrontmatterSchema } from '@openkb/generate';

export function validateCommand(): void {
  const root = process.cwd();
  console.log(`\n🔍 [OpenKB] Validating documentation configuration and OKF files...\n`);

  let errors = 0;
  let warnings = 0;

  // 1. Validate docs.json
  const configPath = path.join(root, 'docs.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ Missing `docs.json` in repository root.');
    errors++;
  } else {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const result = DocsConfigSchema.safeParse(parsed);
      if (!result.success) {
        console.error('❌ `docs.json` validation errors:');
        for (const issue of result.error.issues) {
          console.error(`   - [${issue.path.join('.')}] ${issue.message}`);
        }
        errors++;
      } else {
        console.log(`✅ Validated docs.json (Project: "${result.data.name}", Theme: "${result.data.theme}")`);
      }
    } catch (err: any) {
      console.error('❌ Failed to parse `docs.json` as valid JSON:', err.message);
      errors++;
    }
  }

  // 2. Validate content files for OKF v0.2 frontmatter
  const contentDir = path.join(root, 'content');
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    console.log(`\n📄 Checking ${files.length} document(s) for Google OKF v0.2 frontmatter...`);

    for (const file of files) {
      const fullPath = path.join(contentDir, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(raw);

      const result = OkfFrontmatterSchema.safeParse(data);
      if (!result.success) {
        console.warn(`⚠️  ${file} frontmatter notices:`);
        for (const issue of result.error.issues) {
          console.warn(`   - [${issue.path.join('.')}] ${issue.message}`);
        }
        warnings++;
      } else {
        console.log(`   ✅ ${file} (Type: ${result.data.type}, Status: ${result.data.status})`);
      }
    }
  } else {
    console.warn('⚠️  No `content/` directory found.');
    warnings++;
  }

  console.log(`\n📊 Validation summary: ${errors} error(s), ${warnings} warning(s).\n`);
  if (errors > 0) {
    process.exit(1);
  }
}
