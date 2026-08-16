import type { APIRoute } from 'astro';
import { loadDocsConfig, flattenNavigation } from '@todo-labs/openkb-renderer';

export const prerender = true;

export const GET: APIRoute = async () => {
  const config = loadDocsConfig();
  const flatNav = flattenNavigation(config);

  const lines: string[] = [
    `# ${config.name}`,
    `> ${config.description || 'Developer documentation and knowledge base'}`,
    '',
    '## Documentation Pages',
    '',
  ];

  for (const item of flatNav) {
    lines.push(`- [${item.title}](${item.href}): ${item.group ? `Part of ${item.group}. ` : ''}${item.href}`);
  }

  lines.push('');
  lines.push('## AI Agent Instructions');
  lines.push('This knowledge catalog complies with Google Open Knowledge Format (OKF v0.2).');
  lines.push('Each concept file contains YAML frontmatter with type, trust provenance, and link graphs.');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
