export function extractYoutubeVideoId(url: string): string | undefined {
  const match = url.match(/[?&]v=([^&]+)/)
  return match?.[1]
}
