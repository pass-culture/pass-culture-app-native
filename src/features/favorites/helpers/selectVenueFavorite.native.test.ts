import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import { selectVenueFavorite } from 'features/favorites/helpers/selectVenueFavorite'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'

describe('selectVenueFavorite', () => {
  it('should return undefined if data is undefined', () => {
    expect(selectVenueFavorite(undefined, venueDataTest.id)).toBeUndefined()
  })

  it('should return undefined if favorites array is undefined or empty', () => {
    const emptyData = { ...paginatedVenueFavoritesResponseSnap, favorites: [] }

    expect(selectVenueFavorite(emptyData, venueDataTest.id)).toBeUndefined()
  })

  it('should return undefined if venueId is undefined', () => {
    expect(selectVenueFavorite(paginatedVenueFavoritesResponseSnap, undefined)).toBeUndefined()
  })

  it('should return undefined if the venue is not in the favorites list', () => {
    expect(selectVenueFavorite(paginatedVenueFavoritesResponseSnap, 5000)).toBeUndefined()
  })

  it('should return the corresponding favorite when venueId matches', () => {
    const result = selectVenueFavorite(paginatedVenueFavoritesResponseSnap, venueDataTest.id)

    expect(result).toEqual(paginatedVenueFavoritesResponseSnap.favorites[0])
  })
})
