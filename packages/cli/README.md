# @todo-labs/openkb

OpenKB is a CLI for building static, AI-native documentation sites. It combines Astro rendering, MDX components, Google Open Knowledge Format (OKF) frontmatter, and optional codebase synthesis.

## Install

Run commands without a global install:

```bash
npx @todo-labs/openkb init my-docs
```

Or install it globally:

```bash
pnpm add -g @todo-labs/openkb
```

## Commands

```bash
openkb init [directory]          # create a docs project
openkb dev --port 3000           # start local development
openkb build                     # emit a static site to dist/
openkb validate                  # validate docs.json and OKF frontmatter
openkb generate --init           # create starter knowledge documents
openkb generate --update         # run the current synthesis workflow
```

`generate` uses a read-only OpenCode agent with OpenRouter as its only model provider. Set `OPENROUTER_API_KEY` before running it. Use `--output <directory>` to change the generated document directory.

## Configure the site

`docs.json` is the project configuration. The `style` block controls the documentation reading environment; `colors.primary` controls the brand accent.

```json
{
  "name": "Acme Docs",
  "colors": { "primary": "#0f766e" },
  "style": {
    "preset": "atlas",
    "typography": "sans",
    "density": "comfortable",
    "radius": "soft",
    "layout": "standard"
  }
}
```

Available presets are `atlas` (calm knowledge base), `terminal` (dense dark reference), and `notebook` (warm explanatory guides). `style.colors` can override individual surface tokens.

## Related packages

- [`@todo-labs/openkb-renderer`](https://www.npmjs.com/package/@todo-labs/openkb-renderer) provides the Astro layout and MDX components.
- [`@todo-labs/openkb-generate`](https://www.npmjs.com/package/@todo-labs/openkb-generate) provides the codebase scanner and synthesis API.

See the [project documentation](https://todo-labs.github.io/openkb/) for the OKF format and deployment guidance.
