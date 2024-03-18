import { VenueTypeCodeKey } from 'api/gen'
import { Venue } from 'features/venue/types'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { algoliaVenuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/AlgoliaVenuesFixture'

describe('adaptAlgoliaVenues', () => {
  it('should adapt AlgoliaVenues into Venues', () => {
    const expectedVenues: Venue[] = [
      {
        label: 'Cinéma de la fin',
        info: 'Paris',
        venueId: 4197,
        _geoloc: { lat: 50, lng: 50 },
        banner_url: null,
        postalCode: '75000',
        venue_type: VenueTypeCodeKey.VISUAL_ARTS,
      },
      {
        label: 'La librairie quantique',
        info: 'Syndicat des librairies physiques',
        venueId: 4192,
        _geoloc: { lat: 50, lng: 50 },
        banner_url:
          'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/venues/CBQA_1678748459',
        postalCode: '',
        venue_type: VenueTypeCodeKey.VISUAL_ARTS,
      },
    ]
    const adaptedVenues = adaptAlgoliaVenues(algoliaVenuesFixture)

    expect(adaptedVenues).toEqual(expectedVenues)
  })
})
