import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';

// ==========================================
// Google OKF v0.2 Specification Schemas
// ==========================================

export const OkfActorSchema = z.string();

export const OkfSourceSchema = z.object({
  uri: z.string(),
  author: OkfActorSchema.optional(),
  usage_count: z.number().optional(),
  last_modified: z.string().optional(),
  usage_window: z.string().optional(),
});

export type OkfSource = z.infer<typeof OkfSourceSchema>;

export const OkfVerificationSchema = z.object({
  by: OkfActorSchema,
  at: z.string(),
  notes: z.string().optional(),
});

export type OkfVerification = z.infer<typeof OkfVerificationSchema>;

export const OkfGenerationSchema = z.object({
  by: OkfActorSchema,
  at: z.string(),
});

export type OkfGeneration = z.infer<typeof OkfGenerationSchema>;

export const OkfFrontmatterSchema = z.object({
  type: z.string().default('Concept'),
  title: z.string().optional(),
  description: z.string().optional(),
  resource: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'stable', 'deprecated']).default('stable'),
  stale_after: z.string().optional(),

  // Trust & Provenance (§5)
  sources: z.array(OkfSourceSchema).default([]),
  generated: OkfGenerationSchema.optional(),
  verified: z.union([z.array(OkfVerificationSchema), OkfVerificationSchema]).optional(),

  // Attested Computation (§10)
  runtime: z.string().optional(),
  computation: z.string().optional(),
  executor: z.string().optional(),
  attester: z.string().optional(),

  // Presentation & Navigation
  sidebarTitle: z.string().optional(),
  icon: z.string().optional(),
  mode: z.enum(['default', 'wide', 'custom', 'center']).default('default'),
  deprecated: z.boolean().default(false),
  hidden: z.boolean().default(false),
  tag: z.string().optional(),
}).passthrough();

export type OkfFrontmatter = z.infer<typeof OkfFrontmatterSchema>;

// ==========================================
// docs.json Top-Level Configuration Schema
// ==========================================

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
      preset: z.enum(['atlas', 'terminal', 'notebook']).default('atlas'),
      typography: z.enum(['sans', 'system', 'mono']).default('sans'),
      density: z.enum(['compact', 'comfortable']).default('comfortable'),
      radius: z.enum(['sharp', 'soft', 'round']).default('soft'),
      layout: z.enum(['standard', 'wide']).default('standard'),
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
      provider: z.literal('openrouter').default('openrouter'),
      model: z.string().default('google/gemini-2.5-flash'),
      outputDir: z.string().default('./openwiki'),
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
