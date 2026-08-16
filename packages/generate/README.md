# @todo-labs/openkb-generate

Codebase scanner and synthesis engine for generating Open Knowledge Format (OKF) documents with OpenRouter or a read-only OpenCode agent.

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

`OPENROUTER_API_KEY` is the preferred environment variable for the default OpenRouter provider. `GEMINI_API_KEY` is accepted as a compatibility fallback.

## Agentic synthesis with OpenCode

Use `provider: 'opencode'` to let an OpenCode session discover and read files before drafting each document. The embedded `openkb-docs` agent is configured read-only: file edits, shell access, web access, and external directories are denied. It must cite real repository-relative source files, and OpenKB rejects drafts with invalid or fabricated provenance.

```ts
await generateKnowledgeBase({
  rootDir: process.cwd(),
  outputDir: './content',
  provider: 'opencode',
  model: 'provider/model', // optional; otherwise uses your OpenCode configuration
});
```

The CLI equivalent is `openkb generate --provider opencode --init`. You can also set `generate.provider` to `opencode` in `docs.json`; CLI flags take precedence. OpenCode must already be configured with an authenticated model provider.

## Current workflow

The default OpenRouter provider scans the repository, collects a prioritized context set, and synthesizes three starter concept documents: architecture, quickstart, and modules. The OpenCode provider performs its own repository exploration for each of those documents. Both update agent pointers in `AGENTS.md` and `CLAUDE.md` and record generation state alongside the output.

Treat generated files as drafts: review their claims and source links before marking them verified in OKF frontmatter.

## Exports

The package exports `generateKnowledgeBase`, `OpenRouterClient`, scanning utilities, prompt builders, agent-pointer utilities, state helpers, and OKF schemas.

For a complete documentation site and CLI, see [`@todo-labs/openkb`](https://www.npmjs.com/package/@todo-labs/openkb).
