# OpenKB

> **AI-Native Open-Source Documentation Engine**  
> Powered by **Google OKF v0.2**, **Astro Static Site Generator**, and **AI Codebase Synthesis**.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

---

## What is OpenKB?

**OpenKB** is a modern, developer-first documentation platform designed from the ground up for both human engineers and AI coding agents.

- **🎨 Modern Developer UX**: Full suite of interactive MDX components (`<Card>`, `<Tabs>`, `<Accordion>`, `<Steps>`, `<CodeGroup>`, `<Callout>`, `<ParamField>`, `<ResponseField>`).
- **📐 Google OKF v0.2 Spec**: Uses the Open Knowledge Format with YAML frontmatter, trust & provenance tracking, and concept knowledge graphs.
- **🤖 Living Codebase Synthesis**: Auto-generates and incrementally maintains codebase documentation using **Gemini 3.7 Flash** (via OpenRouter) inspired by LangChain OpenWiki.
- **⚡ 100% Pure Static Output**: Powered by Astro with zero runtime server requirements. Deploy anywhere (GitHub Pages, Cloudflare Pages, Vercel, Netlify, S3).
- **🔍 Zero-Server Static Search**: Built-in instant `Cmd+K` search powered by Pagefind.
- **🧠 Agent-First Discoverability**: Auto-generates `/llms.txt`, `/llms-full.txt`, and manages agent pointers in `AGENTS.md` and `CLAUDE.md`.

---

## Quickstart

```bash
# Initialize a new documentation project
npx @openkb/cli init my-docs

# Navigate to project
cd my-docs

# Start local live-reloading dev server
npx @openkb/cli dev

# Build for static production export
npx @openkb/cli build

# Synthesize living docs from your codebase with AI
npx @openkb/cli generate --init
```

---

## Monorepo Packages

- **`@openkb/cli`** (`packages/cli`): Command-line tool to initialize, develop, build, and generate docs.
- **`@openkb/renderer`** (`packages/renderer`): Astro-powered static documentation generator and MDX component library.
- **`@openkb/generate`** (`packages/generate`): Codebase scanner and OpenRouter AI synthesis engine targeting Gemini 3.7 Flash.

---

## License

MIT © OpenKB Contributors
