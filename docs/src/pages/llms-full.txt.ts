import type { APIRoute } from 'astro';
import { loadDocsConfig } from '@todo-labs/openkb-renderer';

export const prerender = true;

export const GET: APIRoute = async () => {
  const config = loadDocsConfig();
  const pages = import.meta.glob('../../content/**/*.{md,mdx}', {
    eager: true,
    query: '?raw',
    import: 'default',
  });

  const sections: string[] = [
    `# Complete Documentation Corpus for ${config.name}`,
    `Generated on: ${new Date().toISOString()}`,
    '==================================================',
    '',
  ];

  for (const [filepath, rawContent] of Object.entries(pages)) {
    const cleanPath = filepath.replace(/^.*?content\//, '');
    sections.push(`--- FILE: ${cleanPath} ---`);
    sections.push(rawContent as string);
    sections.push('\n\n');
  }

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
