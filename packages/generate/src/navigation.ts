import fs from 'node:fs';
import path from 'node:path';

type NavigationGroup = { group: string; pages?: unknown[]; [key: string]: unknown };
type DocsConfigJson = { navigation?: { tabs?: unknown[]; groups?: unknown[]; [key: string]: unknown }; [key: string]: unknown };

function findConfigPath(rootDir: string, outputDir: string): string | undefined {
  const candidates = [
    path.join(path.dirname(outputDir), 'docs.json'),
    path.join(rootDir, 'docs.json'),
    path.join(rootDir, 'openkb.json'),
  ];
  return candidates.find((candidate, index) => candidates.indexOf(candidate) === index && fs.existsSync(candidate));
}

/** Adds or refreshes a dedicated group without changing a user's existing navigation groups. */
export function updateGeneratedNavigation(rootDir: string, outputDir: string, slugs: string[]): void {
  const configPath = findConfigPath(rootDir, outputDir);
  if (!configPath || slugs.length === 0) return;

  let config: DocsConfigJson;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as DocsConfigJson;
  } catch {
    console.warn(`[OpenKB] Could not update generated navigation: invalid JSON in ${configPath}.`);
    return;
  }

  const navigation = (config.navigation ??= {});
  const generatedGroup: NavigationGroup = { group: 'Generated Knowledge', pages: [...slugs].sort() };

  if (Array.isArray(navigation.tabs) && navigation.tabs.length > 0) {
    const tab = navigation.tabs[0];
    if (!tab || typeof tab !== 'object') return;
    const groups = ((tab as { groups?: unknown[] }).groups ??= []);
    const index = groups.findIndex((entry) => Boolean(entry) && typeof entry === 'object' && (entry as NavigationGroup).group === generatedGroup.group);
    if (index === -1) groups.push(generatedGroup);
    else groups[index] = generatedGroup;
  } else {
    const groups = (navigation.groups ??= []);
    const index = groups.findIndex((entry) => Boolean(entry) && typeof entry === 'object' && (entry as NavigationGroup).group === generatedGroup.group);
    if (index === -1) groups.push(generatedGroup);
    else groups[index] = generatedGroup;
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8');
  console.log(`🧭 [OpenKB] Updated generated navigation in ${configPath}.`);
}
