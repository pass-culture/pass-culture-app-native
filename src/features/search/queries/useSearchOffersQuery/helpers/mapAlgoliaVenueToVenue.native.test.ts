import { Activity } from 'api/gen'
import { AlgoliaVenueOffer, Geoloc } from 'libs/algolia/types'

import { mapAlgoliaVenueToVenue } from './mapAlgoliaVenueToVenue'

describe('mapAlgoliaVenueToVenue', () => {
  const mockGeoloc: Geoloc = { lat: 48.8566, lng: 2.3522 }

  const mockAlgoliaVenueOffer: AlgoliaVenueOffer = {
    id: 1,
    name: 'Lieu 1',
    publicName: 'Lieu 1',
    address: '1 rue de la paix',
    postalCode: '75000',
    city: 'Paris',
    activity: Activity.BOOKSTORE,
    isPermanent: true,
    banner_url: 'https://example.com/banner.jpg',
  }

  it('should map a complete AlgoliaVenueOffer to a Venue', () => {
    const result = mapAlgoliaVenueToVenue(mockAlgoliaVenueOffer, mockGeoloc)

    expect(result).toEqual({
      venueId: 1,
      label: 'Lieu 1',
      info: '1 rue de la paix, Paris',
      activity: Activity.BOOKSTORE,
      _geoloc: mockGeoloc,
      isOpenToPublic: true,
      banner_url: 'https://example.com/banner.jpg',
      postalCode: '75000',
      isPermanent: true,
    })
  })
})
