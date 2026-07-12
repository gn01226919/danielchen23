import type { TechTheme } from "./types";
import { defaultContent } from "./defaults";

/** 過濾危險片段，僅作輕量防護（仍只應信任管理員） */
export function sanitizeCustomCss(css: string): string {
  return css
    .replace(/<\/style/gi, "")
    .replace(/<script/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/@import/gi, "/* @import blocked */");
}

export function techThemeToCssVars(theme?: Partial<TechTheme> | null): string {
  const t = { ...defaultContent.themeTech, ...theme };
  return [
    `--t-bg: ${t.bg}`,
    `--t-bg-elev: ${t.bgElev}`,
    `--t-bg-soft: ${t.bgSoft}`,
    `--t-text: ${t.text}`,
    `--t-heading: ${t.heading}`,
    `--t-muted: ${t.muted}`,
    `--t-dim: ${t.dim}`,
    `--t-accent: ${t.accent}`,
    `--t-accent-2: ${t.accent2}`,
    `--t-string: ${t.string}`,
    `--t-comment: ${t.comment}`,
  ].join("; ");
}

export function techThemeCustomCss(theme?: Partial<TechTheme> | null): string {
  const t = { ...defaultContent.themeTech, ...theme };
  if (!t.customCss?.trim()) return "";
  return sanitizeCustomCss(t.customCss);
}
