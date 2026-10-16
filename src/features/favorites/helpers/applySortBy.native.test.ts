import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { applySortBy } from 'features/favorites/helpers/applySortBy'
import { Position } from 'libs/location/types'

describe('applySortBy', () => {
  const favorites = paginatedFavoritesResponseSnap.favorites
  const position: Position = {
    latitude: 48.8566,
    longitude: 2.3522,
  }

  it('should return an empty array when list is empty', () => {
    expect(applySortBy([], 'RECENTLY_ADDED', null)).toEqual([])
  })

  it('should sort favorites by ascending price when sortBy is "ASCENDING_PRICE"', () => {
    const favoritesPrices = [
      { ...favorites[0], offer: { ...favorites[0].offer, price: 2000 } },
      { ...favorites[1], offer: { ...favorites[0].offer, price: 1000 } },
    ]

    const result = applySortBy(favoritesPrices, 'ASCENDING_PRICE', null)

    expect(result.map((fav) => fav.offer.price)).toEqual([1000, 2000])
  })

  it('should sort favorites by descending id when sortBy is "RECENTLY_ADDED"', () => {
    const result = applySortBy(favorites, 'RECENTLY_ADDED', null)

    expect(result.map((fav) => fav.id)).toEqual([393, 389, 381, 380])
  })

  describe('when sortBy is "AROUND_ME"', () => {
    it('should sort favorites by ascending distance when position is provided', () => {
      const result = applySortBy(favorites, 'AROUND_ME', position)

      expect(result.map((fav) => fav.id)).toEqual([393, 389, 380, 381])
    })

    it('should return the original order when position is missing', () => {
      const result = applySortBy(favorites, 'AROUND_ME', null)

      expect(result).toEqual(favorites)
    })
  })
})
