import type { CodebaseContext } from './scanner';

export function buildSystemPrompt(generatedBy = 'openkb/openrouter'): string {
  return `You are OpenKB Synthesizer, an expert AI documentation engineer.
Your task is to analyze codebases and produce structured, living technical documentation conforming strictly to the Google Open Knowledge Format (OKF v0.2) specification.

### OKF v0.2 Rules:
1. Every concept document MUST start with a valid YAML frontmatter block enclosed by '---'.
2. The frontmatter MUST include:
   - type: (e.g. Architecture, Module, Workflow, API, or Concept)
   - title: Human-readable concept title
   - description: Concise 1-line summary
   - tags: [array of keywords]
   - status: stable
   - sources: [ { uri: "real/repository/path", author: "process:git-scanner" } ]
   - generated: { by: "${generatedBy}", at: "${new Date().toISOString()}" }
3. Internal cross-links MUST use standard markdown syntax: [Link Text](/concept-name).
4. The prose body MUST be technical, precise, and well-structured with clear markdown headings, bullet points, and code examples.
5. Every source URI must be a real repository-relative path from the supplied context. Do NOT invent or use placeholder paths.
6. Do NOT include markdown code-block wrappers (\`\`\`markdown ... \`\`\`) around the entire file. Output the raw Markdown document directly.`;
}

export function buildConceptGenerationPrompt(
  conceptName: string,
  conceptType: string,
  context: CodebaseContext
): string {
  return `Analyze the following codebase and generate an OKF v0.2 concept document for: "${conceptName}" (Type: ${conceptType}).

### Repository File Tree:
${context.fileTree.slice(0, 100).join('\n')}

### Recent Git Commit History:
${context.gitLogSummary}

### Key Source Files:
${context.primaryFiles
  .map((f) => `--- File: ${f.path} ---\n${f.content}`)
  .join('\n\n')}

Generate the complete OKF document for "${conceptName}". Output only the Markdown file with YAML frontmatter.`;
}

export function buildAgenticConceptPrompt(conceptName: string, conceptType: string): string {
  return `You are producing an evidence-backed Open Knowledge Format (OKF v0.2) document for the current repository.

First investigate before writing. Use repository file discovery and search to locate the entry points, manifests, implementation modules, tests, configuration, and relevant git history for this concept. Read the files you cite. Do not rely on filenames or guesses.

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
