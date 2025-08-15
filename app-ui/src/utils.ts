import type { SiteConfig } from '@/types'

declare global {
  interface Window { __CC_API_URI__?: string }
}
export const api_uri = (import.meta as any).env?.VITE_API_URI || (typeof window !== 'undefined' ? (window as any).__CC_API_URI__ : undefined) || 'http://localhost:4000'

export function isMobile(): boolean {
  return window.innerWidth <= 500
}

export function isDesktop(): boolean {
  return window.innerWidth >= 1050
}

export function openLink(href: string, target = '_self') {
  window.open(href, target, 'noreferrer noopener')
}

// De-duplicate siteConfig. Source of truth in src/config/site.config.ts
let loadedSiteConfig: SiteConfig
async function loadSiteConfig(): Promise<SiteConfig> {
  if (loadedSiteConfig) return loadedSiteConfig
  const mod = await import('@/config/site.config')
  loadedSiteConfig = mod.siteConfig as SiteConfig
  return loadedSiteConfig
}
// Consumers in SSR-safe contexts should import directly from config; this is for lazy reads only.
export { loadSiteConfig as loadSiteConfigAsync }