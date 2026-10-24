// Base path the site is served from ('' on a custom domain, '/website' on
// ratcityhomebrewclub.github.io/website). next/link and the router add it
// automatically; plain asset URLs (images, CSS backgrounds) need withBase().
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBase(src) {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return src;
  if (basePath && src.startsWith(basePath + '/')) return src;
  return basePath + src;
}
