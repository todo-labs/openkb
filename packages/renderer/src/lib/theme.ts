import type { DocsConfig } from './config';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primary50: string;
  primary100: string;
  primary500: string;
  primary600: string;
}

type SurfaceTokens = {
  background: string;
  backgroundSubtle: string;
  elevated: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderSubtle: string;
  codeBackground: string;
  navbar: string;
};

const STYLE_PRESETS: Record<'atlas' | 'terminal' | 'notebook', SurfaceTokens> = {
  // A calm reading surface with ink-like hierarchy: the default for knowledge bases.
  atlas: {
    background: '#fcfcfb', backgroundSubtle: '#f5f5f2', elevated: '#ffffff',
    text: '#1c1c1a', textMuted: '#5f5f59', textFaint: '#8c8c84',
    border: 'rgba(28, 28, 26, 0.12)', borderSubtle: 'rgba(28, 28, 26, 0.07)',
    codeBackground: '#171917', navbar: 'rgba(252, 252, 251, 0.88)',
  },
  // Dense, high-signal treatment for APIs and operational runbooks.
  terminal: {
    background: '#101311', backgroundSubtle: '#171b18', elevated: '#1b201d',
    text: '#e8eee8', textMuted: '#aab5aa', textFaint: '#758075',
    border: 'rgba(232, 238, 232, 0.13)', borderSubtle: 'rgba(232, 238, 232, 0.07)',
    codeBackground: '#090b0a', navbar: 'rgba(16, 19, 17, 0.9)',
  },
  // Warm paper for explanatory guides and learning material.
  notebook: {
    background: '#fffdf8', backgroundSubtle: '#f8f3e8', elevated: '#fffefa',
    text: '#302a20', textMuted: '#675e50', textFaint: '#958a79',
    border: 'rgba(48, 42, 32, 0.14)', borderSubtle: 'rgba(48, 42, 32, 0.08)',
    codeBackground: '#28231b', navbar: 'rgba(255, 253, 248, 0.9)',
  },
};

export const THEME_PRESETS: Record<
  string,
  { primary: string; light: string; dark: string }
> = {
  emerald: {
    primary: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  sapphire: {
    primary: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
  obsidian: {
    primary: '#64748b',
    light: '#94a3b8',
    dark: '#475569',
  },
  amber: {
    primary: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  rose: {
    primary: '#f43f5e',
    light: '#fb7185',
    dark: '#e11d48',
  },
};

export function resolveThemeColors(config: DocsConfig): ThemeColors {
  const preset = THEME_PRESETS[config.theme] || THEME_PRESETS.emerald;
  const primary = config.colors?.primary || preset.primary;
  const light = config.colors?.light || preset.light;
  const dark = config.colors?.dark || preset.dark;

  return {
    primary,
    primaryLight: light,
    primaryDark: dark,
    primary50: `color-mix(in srgb, ${primary} 8%, transparent)`,
    primary100: `color-mix(in srgb, ${primary} 16%, transparent)`,
    primary500: primary,
    primary600: dark,
  };
}

export function generateCssVariables(config: DocsConfig): string {
  const colors = resolveThemeColors(config);
  const style = config.style;
  const preset = STYLE_PRESETS[style.preset];
  const custom = style.colors || {};
  const density = style.density === 'compact'
    ? { prose: '0.9rem', line: '1.68', section: '2rem', control: '0.3125rem' }
    : { prose: '0.96875rem', line: '1.78', section: '2.75rem', control: '0.4375rem' };
  const radius = style.radius === 'sharp' ? '0.2rem' : style.radius === 'round' ? '0.875rem' : '0.5rem';
  const typeface = style.typography === 'mono'
    ? "'JetBrains Mono', ui-monospace, monospace"
    : style.typography === 'system'
      ? 'ui-sans-serif, system-ui, sans-serif'
      : "'Inter', ui-sans-serif, system-ui, sans-serif";
  return `
    :root {
      --primary-color: ${colors.primary};
      --primary-light: ${colors.primaryLight};
      --primary-dark: ${colors.primaryDark};
      --primary-50: ${colors.primary50};
      --primary-100: ${colors.primary100};
      --primary-500: ${colors.primary500};
      --primary-600: ${colors.primary600};
      --bg-base: ${custom.background || preset.background};
      --bg-subtle: ${custom.backgroundSubtle || preset.backgroundSubtle};
      --bg-elevated: ${preset.elevated};
      --navbar-bg: ${preset.navbar};
      --text-main: ${custom.text || preset.text};
      --text-muted: ${custom.textMuted || preset.textMuted};
      --text-faint: ${preset.textFaint};
      --border-color: ${custom.border || preset.border};
      --border-subtle: ${preset.borderSubtle};
      --code-bg: ${custom.codeBackground || preset.codeBackground};
      --font-body: ${typeface};
      --prose-size: ${density.prose};
      --prose-leading: ${density.line};
      --section-space: ${density.section};
      --control-radius: ${radius};
      --card-radius: calc(${radius} + 0.1875rem);
      --docs-max-width: ${style.layout === 'wide' ? '96rem' : '84rem'};
    }
  `;
}
