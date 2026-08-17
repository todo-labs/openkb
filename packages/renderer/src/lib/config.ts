import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';

// Schema for navigation items
export const NavPageSchema = z.string();

export type NavGroup = {
  group: string;
  icon?: string;
  expanded?: boolean;
  pages: (string | NavGroup)[];
};

export const NavGroupSchema: z.ZodType<NavGroup> = z.lazy(() =>
  z.object({
    group: z.string(),
    icon: z.string().optional(),
    expanded: z.boolean().default(true),
    pages: z.array(z.union([z.string(), NavGroupSchema])),
  })
);

export const NavTabSchema = z.object({
  tab: z.string(),
  icon: z.string().optional(),
  href: z.string().optional(),
  groups: z.array(NavGroupSchema).optional(),
  pages: z.array(z.string()).optional(),
});

export type NavTab = z.infer<typeof NavTabSchema>;

export const NavigationSchema = z.object({
  tabs: z.array(NavTabSchema).optional(),
  groups: z.array(NavGroupSchema).optional(),
  pages: z.array(z.string()).optional(),
});

export type NavigationConfig = z.infer<typeof NavigationSchema>;

// Top-level configuration schema for docs.json
export const DocsConfigSchema = z.object({
  $schema: z.string().optional(),
  name: z.string().default('OpenKB Docs'),
  description: z.string().optional(),
  theme: z.enum(['emerald', 'sapphire', 'obsidian', 'amber', 'rose']).default('emerald'),
  colors: z
    .object({
      primary: z.string().default('#10b981'),
      light: z.string().optional(),
      dark: z.string().optional(),
    })
    .default({ primary: '#10b981' }),
  style: z
    .object({
      /** A named starting point; individual tokens below always take precedence. */
      preset: z.enum(['atlas', 'terminal', 'notebook']).default('atlas'),
      /** Text face for reading documentation; `mono` is useful for reference-heavy docs. */
      typography: z.enum(['sans', 'system', 'mono']).default('sans'),
      density: z.enum(['compact', 'comfortable']).default('comfortable'),
      radius: z.enum(['sharp', 'soft', 'round']).default('soft'),
      layout: z.enum(['standard', 'wide']).default('standard'),
      /** Optional surface overrides for a fully branded site. */
      colors: z
        .object({
          background: z.string().optional(),
          backgroundSubtle: z.string().optional(),
          text: z.string().optional(),
          textMuted: z.string().optional(),
          border: z.string().optional(),
          codeBackground: z.string().optional(),
        })
        .optional(),
    })
    .default({
      preset: 'atlas',
      typography: 'sans',
      density: 'comfortable',
      radius: 'soft',
      layout: 'standard',
    }),
  logo: z
    .object({
      light: z.string().optional(),
      dark: z.string().optional(),
      href: z.string().default('/'),
      text: z.string().optional(),
    })
    .optional(),
  favicon: z.string().default('/favicon.svg'),
  appearance: z
    .object({
      default: z.enum(['system', 'light', 'dark']).default('system'),
      strict: z.boolean().default(false),
    })
    .default({ default: 'system', strict: false }),
  search: z
    .object({
      enabled: z.boolean().default(true),
      results: z.number().int().min(1).max(20).default(8),
      titleWeight: z.number().min(0).max(10).default(8),
      descriptionWeight: z.number().min(0).max(10).default(2),
      tagsWeight: z.number().min(0).max(10).default(4),
      typeWeight: z.number().min(0).max(10).default(3),
    })
    .default({ enabled: true, results: 8, titleWeight: 8, descriptionWeight: 2, tagsWeight: 4, typeWeight: 3 }),
  navigation: NavigationSchema.default({
    pages: ['index'],
  }),
  navbar: z
    .object({
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
            target: z.string().optional(),
          })
        )
        .default([]),
      primary: z
        .object({
          type: z.enum(['button', 'github']).default('button'),
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    })
    .optional(),
  footer: z
    .object({
      socials: z
        .object({
          github: z.string().optional(),
          x: z.string().optional(),
          discord: z.string().optional(),
          linkedin: z.string().optional(),
        })
        .optional(),
      copyright: z.string().optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
  okf: z
    .object({
      version: z.literal('0.2').default('0.2'),
      bundleRoot: z.string().default('./content'),
      showProvenance: z.boolean().default(true),
    })
    .default({ version: '0.2', bundleRoot: './content', showProvenance: true }),
  generate: z
    .object({
      outputDir: z.string().default('./content'),
    })
    .optional(),
});

export type DocsConfig = z.infer<typeof DocsConfigSchema>;

export function loadDocsConfig(rootDir: string = process.cwd()): DocsConfig {
  const possiblePaths = [
    path.join(rootDir, 'docs.json'),
    path.join(rootDir, 'openkb.json'),
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return DocsConfigSchema.parse(parsed);
      } catch (err) {
        console.warn(`[OpenKB] Warning: Failed to parse ${configPath}, using defaults.`, err);
      }
    }
  }

  return DocsConfigSchema.parse({});
}
