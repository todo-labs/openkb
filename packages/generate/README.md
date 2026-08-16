# @todo-labs/openkb-generate

Codebase scanner and OpenRouter-powered synthesis engine for generating Open Knowledge Format (OKF) documents.

## Install

```bash
pnpm add @todo-labs/openkb-generate
```

## Use programmatically

```ts
import { generateKnowledgeBase } from '@todo-labs/openkb-generate';

await generateKnowledgeBase({
  rootDir: process.cwd(),
  outputDir: './content',
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'google/gemini-2.5-flash',
  mode: 'init',
});
```

`OPENROUTER_API_KEY` is the preferred environment variable. `GEMINI_API_KEY` is accepted as a compatibility fallback. The package uses OpenRouter's Chat Completions API.

## Current workflow

The generator scans the repository, collects a prioritized context set, and synthesizes three starter concept documents: architecture, quickstart, and modules. It also updates agent pointers in `AGENTS.md` and `CLAUDE.md` and records generation state alongside the output.

This is a context-driven generation workflow, not yet a tool-using code agent. Treat generated files as drafts: review their claims and source links before marking them verified in OKF frontmatter.

## Exports

The package exports `generateKnowledgeBase`, `OpenRouterClient`, scanning utilities, prompt builders, agent-pointer utilities, state helpers, and OKF schemas.

For a complete documentation site and CLI, see [`@todo-labs/openkb`](https://www.npmjs.com/package/@todo-labs/openkb).
