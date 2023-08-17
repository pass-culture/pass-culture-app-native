export function buildImageUrl(url: string): string
export function buildImageUrl(url?: string): string | undefined

export function buildImageUrl(url?: string): string | undefined {
  return url ? `https:${url}` : undefined
}
