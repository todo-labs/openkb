import { spawn } from 'node:child_process';

export function devCommand(options: { port?: string } = {}): void {
  const port = options.port || '3000';
  console.log(`\n⚡ [OpenKB] Starting local dev server on http://localhost:${port}...\n`);

  const astroBin = 'astro';
  const child = spawn('npx', [astroBin, 'dev', '--port', port], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.on('error', (err) => {
    console.error('[OpenKB] Failed to start dev server:', err);
  });
}
