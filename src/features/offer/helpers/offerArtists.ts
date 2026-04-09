import { OfferArtist } from 'api/gen'
import { OF_ROLES, WITH_ROLES } from 'features/offer/constant'
import { ArtistsLine } from 'features/offerRefacto/types'

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

export const getArtistsLines = (artists: OfferArtist[]) => {
  const ofArtists = artists.filter((a) => !a.role || OF_ROLES.includes(a.role))
  const withArtists = artists.filter((a) => a.role && WITH_ROLES.includes(a.role))

  const lines: ArtistsLine[] = []

  if (ofArtists.length > 0) {
    lines.push({ prefix: 'de', artists: ofArtists })
  }
  if (withArtists.length > 0) {
    lines.push({ prefix: 'avec', artists: withArtists })
  }

  return lines
}
