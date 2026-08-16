export function buildConceptInventoryPrompt(): string {
  return `You are mapping the current repository into an Open Knowledge Format (OKF v0.2) documentation set.

Investigate the repository directly using file discovery, search, and file reading. Do not delegate this task. Identify every material, user-meaningful concept that deserves its own documentation page: architecture, packages, public workflows, commands, configuration, data formats, extension points, and deployment or publishing behavior when present. Do not impose a numeric limit and do not invent concepts that the repository cannot support.

Return only a JSON array. Each item must have exactly these fields:
- "slug": a unique lowercase kebab-case filename stem
- "title": a clear page title
- "type": a concise OKF concept type such as Architecture, Package, Workflow, Configuration, API, or Deployment
- "description": one sentence describing the page
- "sources": an array of repository-relative source paths you inspected and that are most relevant to this concept

The inventory must be complete but non-overlapping. Include enough source paths for the next agent to start focused research. Never edit, create, delete, or run commands in the repository.`;
}

export function buildAgenticConceptPrompt(
  conceptName: string,
  conceptType: string,
  description: string,
  suggestedSources: string[]
): string {
  const evidence = suggestedSources.length > 0
    ? `Start with these relevant files discovered during repository mapping: ${suggestedSources.join(', ')}. Read them, then inspect only additional files needed to verify the concept.`
    : 'Locate and read the most relevant repository files before writing.';

  return `You are producing an evidence-backed Open Knowledge Format (OKF v0.2) document for the current repository.

${evidence}
Do not rely on filenames or guesses. Work directly; do not delegate this task to another agent. You have a focused research budget: after reading the supplied evidence and only the necessary supporting files, write the document immediately. Do not spend the session narrating research progress.

Generate a document for "${conceptName}" (type: ${conceptType}). Its intended scope is: ${description}

Rules:
1. You are read-only: never edit, create, delete, or run commands in the repository.
2. Every factual claim must be supported by files you inspected. If you cannot establish something, say so rather than infer it.
3. Output raw MDX only. Start immediately with YAML frontmatter; do not wrap it in a Markdown code fence.
4. Frontmatter must include type, title, description, tags, status: stable, and sources.
5. Each sources[].uri must be a real repository-relative path you read, and its author must be "agent:opencode".
6. Include generated.by: "openkb/opencode" and generated.at: "${new Date().toISOString()}".
7. Use internal links only when the target document is known to exist. Explain architecture and behavior with concrete file and symbol references.

After checking that every source path is real, return only the complete document.`;
}
