import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { paginatedArtistFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedArtistFavoritesResponseSnap'

import { selectArtistFavorite } from './selectArtistFavorite'

describe('selectArtistFavorite', () => {
  it('should return undefined if data is undefined', () => {
    expect(selectArtistFavorite(undefined, mockArtist.id)).toBeUndefined()
  })

  it('should return undefined if favorites array is undefined or empty', () => {
    const emptyData = { ...paginatedArtistFavoritesResponseSnap, favorites: [] }

    expect(selectArtistFavorite(emptyData, mockArtist.id)).toBeUndefined()
  })

  it('should return undefined if artistId is undefined or empty', () => {
    expect(selectArtistFavorite(paginatedArtistFavoritesResponseSnap, undefined)).toBeUndefined()
    expect(selectArtistFavorite(paginatedArtistFavoritesResponseSnap, '')).toBeUndefined()
  })

  it('should return undefined if the artist is not in the favorites list', () => {
    expect(
      selectArtistFavorite(paginatedArtistFavoritesResponseSnap, 'unknown-artist-id')
    ).toBeUndefined()
  })

  it('should return the corresponding favorite when artistId matches', () => {
    const result = selectArtistFavorite(paginatedArtistFavoritesResponseSnap, mockArtist.id)

    expect(result).toEqual(paginatedArtistFavoritesResponseSnap.favorites[0])
  })
})
