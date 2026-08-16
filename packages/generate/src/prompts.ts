export function buildAgenticConceptPrompt(conceptName: string, conceptType: string): string {
  return `You are producing an evidence-backed Open Knowledge Format (OKF v0.2) document for the current repository.

First investigate before writing. Use repository file discovery and search to locate the entry points, manifests, implementation modules, tests, configuration, and relevant git history for this concept. Read the files you cite. Do not rely on filenames or guesses. Work directly; do not delegate this task to another agent.

Generate a document for "${conceptName}" (type: ${conceptType}).

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
