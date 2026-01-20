export function getArtistsButtonLabel(artistsNames: string[]): string {
  const count = artistsNames.length

  if (count > 2) {
    const firstTwo = artistsNames.slice(0, 2).join(', ')
    const remainingCount = count - 2

    const label = remainingCount === 1 ? 'autre' : 'autres'

    return `${firstTwo} et ${remainingCount} ${label}`
  }

  return artistsNames.join(', ')
}
