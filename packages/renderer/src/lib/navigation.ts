import type { DocsConfig, NavGroup, NavTab } from './config';

export interface FlatNavItem {
  slug: string;
  title: string;
  href: string;
  icon?: string;
  tag?: string;
  group?: string;
  tab?: string;
}

export interface SidebarSection {
  title?: string;
  icon?: string;
  items: {
    title: string;
    slug: string;
    href: string;
    icon?: string;
    tag?: string;
    active?: boolean;
  }[];
}

/**
 * Flattens the docs.json navigation structure into a linear list of pages for prev/next traversal
 */
export function flattenNavigation(
  config: DocsConfig,
  pagesMetadata: Record<string, { title?: string; icon?: string; tag?: string }> = {}
): FlatNavItem[] {
  const result: FlatNavItem[] = [];

  function cleanSlug(pagePath: string): string {
    return pagePath.replace(/^\//, '').replace(/\.mdx?$/, '');
  }

  function resolveItem(pagePath: string, groupName?: string, tabName?: string): FlatNavItem {
    const slug = cleanSlug(pagePath);
    const meta = pagesMetadata[slug] || {};
    const href = slug === 'index' ? '/' : `/${slug}`;
    const defaultTitle = slug
      .split('/')
      .pop()!
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      slug,
      title: meta.title || defaultTitle,
      href,
      icon: meta.icon,
      tag: meta.tag,
      group: groupName,
      tab: tabName,
    };
  }

  function flattenGroupItems(pages: (string | NavGroup)[], groupName?: string, tabName?: string): void {
    for (const item of pages) {
      if (typeof item === 'string') {
        result.push(resolveItem(item, groupName, tabName));
      } else if (item && typeof item === 'object' && 'pages' in item) {
        flattenGroupItems(item.pages, item.group || groupName, tabName);
      }
    }
  }

  if (config.navigation.tabs && config.navigation.tabs.length > 0) {
    for (const tab of config.navigation.tabs) {
      if (tab.pages) {
        for (const p of tab.pages) {
          result.push(resolveItem(p, undefined, tab.tab));
        }
      }
      if (tab.groups) {
        for (const g of tab.groups) {
          flattenGroupItems(g.pages, g.group, tab.tab);
        }
      }
    }
  } else if (config.navigation.groups && config.navigation.groups.length > 0) {
    for (const g of config.navigation.groups) {
      flattenGroupItems(g.pages, g.group);
    }
  } else if (config.navigation.pages) {
    for (const p of config.navigation.pages) {
      result.push(resolveItem(p));
    }
  }

  return result;
}

/**
 * Builds sidebar structure for the current page and active tab
 */
export function getSidebarSections(
  config: DocsConfig,
  currentSlug: string,
  pagesMetadata: Record<string, { title?: string; icon?: string; tag?: string }> = {}
): { activeTab?: NavTab; sections: SidebarSection[] } {
  const normalizedCurrent = currentSlug.replace(/^\//, '').replace(/\/$/, '') || 'index';
  const sections: SidebarSection[] = [];

  function checkPageMatch(p: string | NavGroup): boolean {
    if (typeof p === 'string') {
      return p.replace(/^\//, '').replace(/\.mdx?$/, '') === normalizedCurrent;
    }
    return p.pages.some(checkPageMatch);
  }

  // Determine active tab if tabs exist
  let activeTab: NavTab | undefined;
  if (config.navigation.tabs && config.navigation.tabs.length > 0) {
    // Find tab containing current slug
    for (const tab of config.navigation.tabs) {
      const hasPage =
        tab.pages?.some((p) => p.replace(/^\//, '').replace(/\.mdx?$/, '') === normalizedCurrent) ||
        tab.groups?.some((g) => g.pages.some(checkPageMatch));
      if (hasPage) {
        activeTab = tab;
        break;
      }
    }
    // Default to first tab
    if (!activeTab) {
      activeTab = config.navigation.tabs[0];
    }
  }

  const groupsToRender: NavGroup[] =
    activeTab?.groups || config.navigation.groups || [];
  const topPagesToRender: string[] =
    activeTab?.pages || config.navigation.pages || [];

  if (topPagesToRender.length > 0 && (!groupsToRender || groupsToRender.length === 0)) {
    sections.push({
      items: topPagesToRender.map((p) => {
        const slug = p.replace(/^\//, '').replace(/\.mdx?$/, '');
        const meta = pagesMetadata[slug] || {};
        return {
          title: meta.title || slug.split('/').pop()!.replace(/[-_]/g, ' '),
          slug,
          href: slug === 'index' ? '/' : `/${slug}`,
          icon: meta.icon,
          tag: meta.tag,
          active: slug === normalizedCurrent,
        };
      }),
    });
  }

  function processGroup(group: NavGroup): void {
    const items: SidebarSection['items'] = [];

    for (const p of group.pages) {
      if (typeof p === 'string') {
        const slug = p.replace(/^\//, '').replace(/\.mdx?$/, '');
        const meta = pagesMetadata[slug] || {};
        items.push({
          title: meta.title || slug.split('/').pop()!.replace(/[-_]/g, ' '),
          slug,
          href: slug === 'index' ? '/' : `/${slug}`,
          icon: meta.icon,
          tag: meta.tag,
          active: slug === normalizedCurrent,
        });
      } else if (p && typeof p === 'object' && 'pages' in p) {
        // Nested subgroup
        processGroup(p as NavGroup);
      }
    }

    if (items.length > 0) {
      sections.push({
        title: group.group,
        icon: group.icon,
        items,
      });
    }
  }

  for (const group of groupsToRender) {
    processGroup(group);
  }

  return { activeTab, sections };
}

/**
 * Finds previous and next page items for pagination
 */
export function getPrevNextNavigation(
  flatNav: FlatNavItem[],
  currentSlug: string
): { prev?: FlatNavItem; next?: FlatNavItem } {
  const normalized = currentSlug.replace(/^\//, '').replace(/\/$/, '') || 'index';
  const index = flatNav.findIndex((item) => item.slug === normalized);

  if (index === -1) {
    return {};
  }

  return {
    prev: index > 0 ? flatNav[index - 1] : undefined,
    next: index < flatNav.length - 1 ? flatNav[index + 1] : undefined,
  };
}
