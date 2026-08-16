import type { CodebaseContext } from './scanner';

export function buildSystemPrompt(): string {
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
   - sources: [ { uri: "filepath", author: "process:git-scanner" } ]
   - generated: { by: "openkb/gemini-3.7-flash", at: "${new Date().toISOString()}" }
3. Internal cross-links MUST use standard markdown syntax: [Link Text](/concept-name).
4. The prose body MUST be technical, precise, and well-structured with clear markdown headings, bullet points, and code examples.
5. Do NOT include markdown code-block wrappers (\`\`\`markdown ... \`\`\`) around the entire file. Output the raw Markdown document directly.`;
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
