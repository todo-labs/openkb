import { z } from 'zod';
import matter from 'gray-matter';

// OKF Actor schema (human:username, process:pipeline, agent/version)
export const OkfActorSchema = z.string();

// OKF Source schema (§5.1)
export const OkfSourceSchema = z.object({
  uri: z.string(),
  author: OkfActorSchema.optional(),
  usage_count: z.number().optional(),
  last_modified: z.string().optional(),
  usage_window: z.string().optional(),
});

export type OkfSource = z.infer<typeof OkfSourceSchema>;

// OKF Verification event schema (§5.3)
export const OkfVerificationSchema = z.object({
  by: OkfActorSchema,
  at: z.string(),
  notes: z.string().optional(),
});

export type OkfVerification = z.infer<typeof OkfVerificationSchema>;

// OKF Generation event schema (§5.2)
export const OkfGenerationSchema = z.object({
  by: OkfActorSchema,
  at: z.string(),
});

export type OkfGeneration = z.infer<typeof OkfGenerationSchema>;

// Complete Google OKF v0.2 Frontmatter Schema + OpenKB Presentation Fields
export const OkfFrontmatterSchema = z.object({
  // === OKF v0.2 Specification Required & Recommended Fields ===
  type: z.string().default('Concept'), // OKF required
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

  // === Presentation & Navigation Fields ===
  sidebarTitle: z.string().optional(),
  icon: z.string().optional(),
  mode: z.enum(['default', 'wide', 'custom', 'center']).default('default'),
  deprecated: z.boolean().default(false),
  hidden: z.boolean().default(false),
  tag: z.string().optional(),
}).passthrough(); // Permissive consumption: preserve unknown keys as per OKF §11

export type OkfFrontmatter = z.infer<typeof OkfFrontmatterSchema>;

export interface ParsedOkfDocument {
  frontmatter: OkfFrontmatter;
  content: string;
  links: string[]; // Extracted internal OKF markdown links
  readingTimeMinutes: number;
}

/**
 * Parses raw MDX/Markdown text and returns validated OKF frontmatter and metadata.
 */
export function parseOkfDocument(rawContent: string): ParsedOkfDocument {
  const { data, content } = matter(rawContent);
  const frontmatter = OkfFrontmatterSchema.parse(data);

  // Extract internal markdown links [Label](/target or ./target)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('#')) {
      links.push(url);
    }
  }

  // Calculate approximate reading time
  const words = content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    frontmatter,
    content,
    links,
    readingTimeMinutes,
  };
}

/**
 * Formats OKF Actor into a human-friendly label
 */
export function formatActorLabel(actor: string): { type: 'human' | 'process' | 'agent'; name: string } {
  if (actor.startsWith('human:')) {
    return { type: 'human', name: actor.replace('human:', '') };
  }
  if (actor.startsWith('process:')) {
    return { type: 'process', name: actor.replace('process:', '') };
  }
  return { type: 'agent', name: actor };
}
