import { LocationType } from 'features/search/enums'
import { Venue } from 'features/venue/types'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const venuesIndexSearch = 'algoliaVenuesIndexPlaylistSearch'
const venuesIndexSearchNewest = 'algoliaVenuesIndexPlaylistSearchNewest'

describe('getCurrentVenuesIndex', () => {
  it("should return algoliaVenuesIndexPlaylistSearchNewest when locationType is EVERYWHERE and user don't share his position", () => {
    const locationType = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex({ locationType })

    expect(result).toEqual(venuesIndexSearchNewest)
  })

  it('should return algoliaVenuesIndexPlaylistSearch when locationType is EVERYWHERE and user shares his position', () => {
    const userPosition = { latitude: 48.90374, longitude: 2.48171 }
    const locationType = LocationType.EVERYWHERE
    const result = getCurrentVenuesIndex({ locationType, userPosition })

    expect(result).toEqual(venuesIndexSearch)
  })

  it.each([LocationType.AROUND_ME, LocationType.PLACE])(
    'should return algoliaVenuesIndexPlaylistSearch when locationType is %s',
    (locationType) => {
      const result = getCurrentVenuesIndex({ locationType })

      expect(result).toEqual(venuesIndexSearch)
    }
  )

  it('should return algoliaVenuesIndexPlaylistSearch when a venue is selected', () => {
    const venue: Venue = mockedSuggestedVenues[0]
    const result = getCurrentVenuesIndex({ venue })

    expect(result).toEqual(venuesIndexSearch)
  })

  it('should return algoliaVenuesIndexPlaylistSearchNewest when neither position, locationType and venue is defined', () => {
    const result = getCurrentVenuesIndex({})

    expect(result).toEqual(venuesIndexSearchNewest)
  })
})
