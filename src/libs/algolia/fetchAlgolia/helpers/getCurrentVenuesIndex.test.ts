import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { LocationMode } from 'libs/algolia/types'

const venuesIndexSearch = 'algoliaVenuesIndexPlaylistSearch'
const venuesIndexSearchNewest = 'algoliaVenuesIndexPlaylistSearchNewest'

const geolocPosition = { latitude: 48.90374, longitude: 2.48171 }

describe('getCurrentVenuesIndex', () => {
  it("should return algoliaVenuesIndexPlaylistSearchNewest when selectedLocationMode is EVERYWHERE and user don't share his position", () => {
    const selectedLocationMode = LocationMode.EVERYWHERE
    const result = getCurrentVenuesIndex({ selectedLocationMode, geolocPosition: undefined })

    expect(result).toEqual(venuesIndexSearchNewest)
  })

  it('should return algoliaVenuesIndexPlaylistSearch when selectedLocationMode is EVERYWHERE and user shares his position', () => {
    const selectedLocationMode = LocationMode.EVERYWHERE
    const result = getCurrentVenuesIndex({ selectedLocationMode, geolocPosition })

    expect(result).toEqual(venuesIndexSearch)
  })

  it.each([LocationMode.AROUND_ME, LocationMode.AROUND_PLACE])(
    'should return algoliaVenuesIndexPlaylistSearch when selectedLocationMode is %s',
    (selectedLocationMode) => {
      const result = getCurrentVenuesIndex({ selectedLocationMode, geolocPosition: undefined })

      expect(result).toEqual(venuesIndexSearch)
    }
  )
})
