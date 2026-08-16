import { execSync } from 'node:child_process';

export function buildCommand(): void {
  console.log('\n📦 [OpenKB] Building static documentation bundle...\n');

  try {
    // 1. Run Astro Static Build
    console.log('1️⃣ Compiling Astro static pages and MDX components...');
    execSync('npx astro build', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    });

    // 2. Run Pagefind Static Search Indexer
    console.log('\n2️⃣ Indexing content for static Pagefind search...');
    try {
      execSync('npx pagefind --site dist', {
        stdio: 'inherit',
      });
    } catch (searchErr) {
      console.warn('[OpenKB] Warning: Pagefind indexing skipped or completed with notices.');
    }

    console.log('\n✨ [OpenKB] Build complete! Static assets generated in ./dist\n');
  } catch (err: any) {
    console.error('\n❌ [OpenKB] Build failed:', err?.message || err);
    process.exit(1);
  }
}
