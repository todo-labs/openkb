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
  model: 'provider/model', // optional; otherwise uses your OpenCode configuration
  mode: 'init',
});
```

OpenCode must be installed and configured with an authenticated model provider. The CLI equivalent is `openkb generate --init`.

## Current workflow

OpenCode performs repository exploration for each of three starter concept documents: architecture, quickstart, and modules. The embedded `openkb-docs` agent is read-only: file edits, shell access, web access, and external directories are denied. It must cite real repository-relative source files, and OpenKB rejects drafts with invalid or fabricated provenance. Generated documents update agent pointers in `AGENTS.md` and `CLAUDE.md` and record generation state alongside the output.

Treat generated files as drafts: review their claims and source links before marking them verified in OKF frontmatter.

## Exports

The package exports `generateKnowledgeBase`, OpenCode synthesis utilities, scanning utilities, prompt builders, agent-pointer utilities, state helpers, and OKF schemas.

For a complete documentation site and CLI, see [`@todo-labs/openkb`](https://www.npmjs.com/package/@todo-labs/openkb).
