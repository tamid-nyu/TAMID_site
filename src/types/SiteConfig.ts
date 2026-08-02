export interface SiteConfigEntry {
  key: string;
  value: string;
}

// INV3: these are backend WIRE-contract config key literals — keep byte-identical
// despite the Mentorship -> Programs page rebrand. Do NOT rename the string literals.
export type SiteConfigKey = 'mentorship_application_open' | 'mentorship_application_url';
