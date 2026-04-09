import { removeGeolocFromVenue } from 'features/search/helpers/searchList/removeGeolocFromVenue'
import { mockedAlgoliaVenueResponse } from 'libs/algolia/fixtures/algoliaFixtures'

describe('removeGeolocFromVenue', () => {
  it('should set latitude and longitude to null while keeping other properties', () => {
    const venue = mockedAlgoliaVenueResponse.hits[0]

    const result = removeGeolocFromVenue(venue)

    expect(result).toMatchObject({
      ...venue,
      _geoloc: { lat: null, lng: null },
    })
  })
})
