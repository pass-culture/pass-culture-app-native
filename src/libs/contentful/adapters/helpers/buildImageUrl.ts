export const buildImageUrl = (url?: string): string | undefined => {
  return url ? `https:${url}` : undefined
}
