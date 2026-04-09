import { Activity } from 'api/gen'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { AlgoliaVenue, AlgoliaVenueOfferListItem } from 'libs/algolia/types'

import { mapAlgoliaVenueToAlgoliaVenueOfferListItem } from './mapAlgoliaVenueToAlgoliaVenueOfferListItem'

describe('mapAlgoliaVenueToAlgoliaVenueOfferListItem', () => {
  const mockAlgoliaVenue = mockAlgoliaVenues[0] as AlgoliaVenue

  it('should map an AlgoliaVenue to AlgoliaVenueOfferListItem', () => {
    const expectedResult: AlgoliaVenueOfferListItem = {
      objectID: '7931',
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
      city: 'Bordeaux',
      name: 'EMS 0063 (ne fonctionne pas)',
      postalCode: '75000',
      activity: Activity.CINEMA,
      _geoloc: { lat: 44.82186, lng: -0.56366 },
    }

    const result = mapAlgoliaVenueToAlgoliaVenueOfferListItem(mockAlgoliaVenue)

    expect(result).toEqual(expectedResult)
  })
})
