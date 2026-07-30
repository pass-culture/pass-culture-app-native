export function isWikipediaUrl(urlString?: string | null) {
  if (!urlString) return false

  try {
    const { protocol, hostname } = new URL(urlString)

    if (protocol !== 'http:' && protocol !== 'https:') return false

    const normalizedHost = hostname.toLowerCase()

    return normalizedHost === 'wikipedia.org' || normalizedHost.endsWith('.wikipedia.org')
  } catch {
    return false
  }
}
