# @todo-labs/openkb-generate

Agentic synthesis engine for generating Open Knowledge Format (OKF) documents with a read-only OpenCode agent.

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
  mode: 'init',
});
```

Set `OPENROUTER_API_KEY` before generation. OpenKB passes it to OpenCode, which provides the agentic repository research loop while OpenRouter supplies model access. The CLI equivalent is `openkb generate --init`.

OpenKB uses `openrouter/deepseek/deepseek-v4-flash` as its fixed synthesis model. The model is deliberately not configurable through the OpenKB CLI or docs configuration, keeping generation behavior and cost predictable.

## Current workflow

OpenCode first maps the repository into a complete, non-overlapping inventory of material concepts. OpenKB then generates one OKF document for every discovered concept—there is no fixed document-count cap. It is restricted to OpenRouter as its model provider. The embedded planning and documentation agents are read-only: file edits, shell access, web access, and external directories are denied. They must cite real repository-relative source files, and OpenKB rejects drafts with invalid or fabricated provenance. Generated documents update agent pointers in `AGENTS.md` and `CLAUDE.md` and record generation state alongside the output.

Treat generated files as drafts: review their claims and source links before marking them verified in OKF frontmatter.

## Exports

The package exports `generateKnowledgeBase`, OpenCode synthesis utilities, scanning utilities, prompt builders, agent-pointer utilities, state helpers, and OKF schemas.

For a complete documentation site and CLI, see [`@todo-labs/openkb`](https://www.npmjs.com/package/@todo-labs/openkb).
