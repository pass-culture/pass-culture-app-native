import { FavoriteResponse } from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { GeoCoordinates } from 'libs/geolocation'

import { sortByIdDesc, sortByAscendingPrice, sortByDistanceAroundMe } from './sorts'

const baseOffer: FavoriteResponse = paginatedFavoritesResponseSnap.favorites[0]

const position = { latitude: 48.8584, longitude: 2.2945 } as GeoCoordinates
const position2 = { latitude: 49.8584, longitude: 3.2945 } as GeoCoordinates
const position3 = { latitude: 50.8584, longitude: 4.2945 } as GeoCoordinates

describe('Favorites sorts', () => {
  it('should sort by RECENTLY_ADDED (API default sort)', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1 },
      { ...baseOffer, id: 3 },
      { ...baseOffer, id: 2 },
    ]
    data.sort(sortByIdDesc)
    expect(data.map(({ id }) => id)).toEqual([3, 2, 1])
  })

  it('should sort by ASCENDING_PRICE', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1, offer: { ...baseOffer.offer, price: 10 } },
      { ...baseOffer, id: 3, offer: { ...baseOffer.offer, price: 30 } },
      { ...baseOffer, id: 4, offer: { ...baseOffer.offer, price: 0 } },
      { ...baseOffer, id: 2, offer: { ...baseOffer.offer, price: 20 } },
    ]
    data.sort(sortByAscendingPrice)
    expect(data.map(({ id }) => id)).toEqual([4, 1, 2, 3])
  })

  it('should sort by ASCENDING_PRICE and place expired offer last', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1, offer: { ...baseOffer.offer, price: 10 } },
      { ...baseOffer, id: 3, offer: { ...baseOffer.offer, price: 30 } },
      { ...baseOffer, id: 4, offer: { ...baseOffer.offer, price: 0 } },
      { ...baseOffer, id: 2, offer: { ...baseOffer.offer, price: 20, isExpired: true } },
    ]
    data.sort(sortByAscendingPrice)
    expect(data.map(({ id }) => id)).toEqual([4, 1, 3, 2])
  })

  it('should sort by ASCENDING_PRICE and place offer with no price last', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1, offer: { ...baseOffer.offer, price: 10 } },
      { ...baseOffer, id: 3, offer: { ...baseOffer.offer, price: 30 } },
      { ...baseOffer, id: 4, offer: { ...baseOffer.offer, price: 0 } },
      { ...baseOffer, id: 2, offer: { ...baseOffer.offer, price: null } },
    ]
    data.sort(sortByAscendingPrice)
    expect(data.map(({ id }) => id)).toEqual([4, 1, 3, 2])
  })

  it('should sort by AROUND_ME', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1, offer: { ...baseOffer.offer, coordinates: position } },
      { ...baseOffer, id: 3, offer: { ...baseOffer.offer, coordinates: position3 } },
      { ...baseOffer, id: 2, offer: { ...baseOffer.offer, coordinates: position2 } },
    ]
    data.sort(sortByDistanceAroundMe(position))
    expect(data.map(({ id }) => id)).toEqual([1, 2, 3])
  })

  it('should sort by AROUND_ME and place offer with no coordinates last', () => {
    const data: Array<FavoriteResponse> = [
      { ...baseOffer, id: 1, offer: { ...baseOffer.offer, coordinates: position } },
      { ...baseOffer, id: 3, offer: { ...baseOffer.offer, coordinates: position3 } },
      { ...baseOffer, id: 2 },
    ]
    data.sort(sortByDistanceAroundMe(position))
    expect(data.map(({ id }) => id)).toEqual([1, 3, 2])
  })
})
