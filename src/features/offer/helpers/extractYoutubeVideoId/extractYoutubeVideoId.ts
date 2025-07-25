export function extractYoutubeVideoId(url: string): string | undefined {
  const regex = /[?&]v=([^&]+)/
  const match = regex.exec(url)
  return match?.[1]
}
