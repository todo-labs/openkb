# @todo-labs/openkb-renderer

Astro layouts, MDX components, navigation helpers, and theming utilities for OpenKB documentation sites.

## Install

```bash
pnpm add @todo-labs/openkb-renderer
```

An OpenKB site also needs Astro, MDX, React, and Tailwind integrations. The generated project from `@todo-labs/openkb` includes the required setup.

## Render a documentation page

```astro
---
import DocsLayout from '@todo-labs/openkb-renderer/layouts/DocsLayout.astro';
import { loadDocsConfig } from '@todo-labs/openkb-renderer';

const config = loadDocsConfig();
---

<DocsLayout
  config={config}
  frontmatter={{ title: 'Example', mode: 'default' }}
  currentSlug="example"
  sections={[]}
  flatNav={[]}
>
  <h1>Example</h1>
</DocsLayout>
```

## Theme configuration

The renderer reads `docs.json` (or `openkb.json`) from the current working directory. Configure a site-wide visual system with `style`:

```json
{
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

`atlas`, `terminal`, and `notebook` are supplied presets. Surface colors can be individually overridden through `style.colors`.

## Exports

The package exports MDX components such as `Card`, `Tabs`, `Callout`, `Steps`, and `ProvenanceBadge`, along with `loadDocsConfig`, navigation helpers, and theme utilities.

For a working project structure, use [`@todo-labs/openkb`](https://www.npmjs.com/package/@todo-labs/openkb).
