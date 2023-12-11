import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'

const venuesIndexSearch = 'algoliaVenuesIndexPlaylistSearch'
const venuesIndexSearchNewest = 'algoliaVenuesIndexPlaylistSearchNewest'

describe('getCurrentVenuesIndex', () => {
  it("should return algoliaVenuesIndexPlaylistSearchNewest when locationType is EVERYWHERE and user don't share his position", () => {
    const result = getCurrentVenuesIndex({ isEverywhereWithNoGeolocPosition: true })

    expect(result).toEqual(venuesIndexSearchNewest)
  })

  it('should return algoliaVenuesIndexPlaylistSearch when locationType is EVERYWHERE and user shares his position', () => {
    const result = getCurrentVenuesIndex({ isEverywhereWithNoGeolocPosition: false })

    expect(result).toEqual(venuesIndexSearch)
  })
})
