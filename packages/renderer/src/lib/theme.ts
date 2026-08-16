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
  return `
    :root {
      --primary-color: ${colors.primary};
      --primary-light: ${colors.primaryLight};
      --primary-dark: ${colors.primaryDark};
      --primary-50: ${colors.primary50};
      --primary-100: ${colors.primary100};
      --primary-500: ${colors.primary500};
      --primary-600: ${colors.primary600};
    }
  `;
}
