import fs from 'node:fs';
import path from 'node:path';

export function initCommand(targetDir: string = '.'): void {
  const root = path.resolve(process.cwd(), targetDir);

  console.log(`\n🚀 [OpenKB] Initializing new documentation in: ${root}`);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  // Create content directory
  const contentDir = path.join(root, 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Write default docs.json
  const defaultDocsJson = {
    $schema: 'https://openkb.dev/schema.json',
    name: 'Acme Documentation',
    description: 'Modern developer docs powered by OpenKB and Google OKF',
    theme: 'emerald',
    colors: {
      primary: '#10b981',
    },
    style: {
      preset: 'atlas',
      typography: 'sans',
      density: 'comfortable',
      radius: 'soft',
      layout: 'standard',
    },
    navigation: {
      tabs: [
        {
          tab: 'Guides',
          groups: [
            {
              group: 'Getting Started',
              pages: ['index', 'quickstart'],
            },
          ],
        },
        {
          tab: 'API Reference',
          groups: [
            {
              group: 'Endpoints',
              pages: ['api/users'],
            },
          ],
        },
      ],
    },
    navbar: {
      links: [
        { label: 'GitHub', href: 'https://github.com' },
      ],
      primary: {
        label: 'Dashboard',
        href: 'https://app.example.com',
      },
    },
    footer: {
      socials: {
        github: 'https://github.com',
        x: 'https://x.com',
      },
    },
    okf: {
      version: '0.2',
      showProvenance: true,
    },
  };

  fs.writeFileSync(
    path.join(root, 'docs.json'),
    JSON.stringify(defaultDocsJson, null, 2),
    'utf-8'
  );

  // Write sample index.mdx
  const sampleIndex = `---
type: Concept
title: Welcome to OpenKB
description: Discover the next generation of living, AI-native documentation.
status: stable
tags: [getting-started, openkb, okf]
sources:
  - uri: "README.md"
    author: "human:founder"
---

# Welcome to OpenKB

OpenKB is an open-source documentation framework designed for **both human developers and AI coding agents**.

<Callout type="tip" title="Google OKF v0.2 Compliant">
Every document in OpenKB is formatted as an Open Knowledge Format concept document, featuring YAML frontmatter, verified trust signals, and machine-traversable link graphs.
</Callout>

## Key Capabilities

<CardGroup cols={2}>
  <Card title="Interactive MDX" icon="sparkles" href="/quickstart">
    Rich interactive components like Tabs, CodeGroups, Accordions, and Callouts out of the box.
  </Card>
  <Card title="AI Living Synthesis" icon="bot" href="/quickstart">
    Auto-synthesizes and updates docs directly from your codebase with Gemini 3.7 Flash.
  </Card>
  <Card title="100% Static Export" icon="zap">
    Pure static HTML/JS output deployable anywhere (GitHub Pages, Cloudflare Pages, S3).
  </Card>
  <Card title="Agent Discoverability" icon="file-text">
    Automatic \`/llms.txt\` and agent pointer synchronization for Cursor, Claude Code, and Copilot.
  </Card>
</CardGroup>

## Getting Started

<Steps>
  <Step title="Explore the Quickstart">
    Head over to the [Quickstart Guide](/quickstart) to configure your navigation and brand theme.
  </Step>
  <Step title="Add your content">
    Create \`.mdx\` files inside the \`content/\` directory with standard OKF frontmatter.
  </Step>
  <Step title="Deploy anywhere">
    Run \`openkb build\` to generate a fully static site in \`dist/\`.
  </Step>
</Steps>
`;

  fs.writeFileSync(path.join(contentDir, 'index.mdx'), sampleIndex, 'utf-8');

  // Write sample quickstart.mdx
  const sampleQuickstart = `---
type: Workflow
title: Quickstart Guide
description: Get up and running with OpenKB in under 3 minutes.
status: stable
tags: [workflow, cli, setup]
sources:
  - uri: "docs/setup.md"
    author: "process:ci-builder"
---

# Quickstart Guide

Follow these steps to customize your documentation site.

## 1. Configure docs.json

Open \`docs.json\` in your project root to set your project name, theme color, and navigation hierarchy:

<CodeGroup>
\`\`\`json docs.json
{
  "name": "My Project Docs",
  "theme": "emerald",
  "colors": {
    "primary": "#10b981"
  }
}
\`\`\`
</CodeGroup>

## 2. Using Interactive Tabs

Switch between package managers or operating systems effortlessly:

<Tabs>
  <Tab title="pnpm">
\`\`\`bash
pnpm add @todo-labs/openkb
\`\`\`
  </Tab>
  <Tab title="npm">
\`\`\`bash
npm install -g @todo-labs/openkb
\`\`\`
  </Tab>
  <Tab title="yarn">
\`\`\`bash
yarn add @todo-labs/openkb
\`\`\`
  </Tab>
</Tabs>
`;

  fs.writeFileSync(path.join(contentDir, 'quickstart.mdx'), sampleQuickstart, 'utf-8');

  console.log('✅ [OpenKB] Project initialized successfully!');
  console.log(`\nNext steps:`);
  console.log(`  1. cd ${targetDir}`);
  console.log(`  2. openkb dev`);
  console.log(`  3. openkb build\n`);
}
