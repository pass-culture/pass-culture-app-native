import { ArtistType, CategoryIdEnum, OfferArtist } from 'api/gen'
import { getArtistsFilterButtons } from 'features/offer/helpers/getArtistsFilterButtons/getArtistsFilterButtons'

describe('getArtistsFilterButtons', () => {
  it('should return an empty array when given an empty list of artists', () => {
    const result = getArtistsFilterButtons([], CategoryIdEnum.CINEMA)

    expect(result).toEqual([])
  })

  it('should ignore artists who do not have a role or an id', () => {
    const mockArtists: OfferArtist[] = [
      { id: '1', name: 'Valid Actor', role: ArtistType.film_actor },
      { id: undefined, name: 'Missing Id', role: ArtistType.film_director },
      { id: '3', name: 'Missing Role', role: undefined },
    ]

    const result = getArtistsFilterButtons(mockArtists, CategoryIdEnum.CINEMA)

    expect(result).toEqual([{ label: 'Acteur (1)', role: 'Acteur' }])
  })

  it('should correctly format labels to singular when a role group has only one artist', () => {
    const mockArtists: OfferArtist[] = [
      { id: '1', name: 'Actor One', role: ArtistType.film_actor },
      { id: '2', name: 'Director One', role: ArtistType.film_director },
    ]

    const result = getArtistsFilterButtons(mockArtists, CategoryIdEnum.CINEMA)

    expect(result).toEqual([
      { role: 'Acteur', label: 'Acteur (1)' },
      { role: 'Réalisateur', label: 'Réalisateur (1)' },
    ])
  })

  it('should correctly format labels to plural when a role group has multiple artists', () => {
    const mockArtists: OfferArtist[] = [
      { id: '1', name: 'Actor One', role: ArtistType.film_actor },
      { id: '2', name: 'Actor Two', role: ArtistType.film_actor },
    ]

    const result = getArtistsFilterButtons(mockArtists, CategoryIdEnum.CINEMA)

    expect(result).toEqual([{ role: 'Acteur', label: 'Acteurs (2)' }])
  })
})
