import { VenueTypeCodeKey } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenuesNumberByType } from 'features/venueMap/helpers/getVenuesNumberByType/getVenuesNumberByType'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'

const venues: GeolocatedVenue[] = [
  ...geolocatedVenuesFixture,
  {
    _geoloc: { lat: 48.81877, lng: 2.41746 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/google_places/19322.jpeg',
    info: 'CHARENTON-LE-PONT',
    label: 'L’Esprit Livre',
    postalCode: '94220',
    venueId: 19322,
    venue_type: VenueTypeCodeKey.BOOKSTORE,
    isOpenToPublic: true,
  },
  {
    _geoloc: { lat: 48.85569, lng: 2.43935 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/google_places/owner9340.jpeg',
    info: 'Montreuil',
    label: 'LIBRAIRIE LIBERTALIA',
    postalCode: '93100',
    venueId: 9340,
    isOpenToPublic: true,
  },
  {
    _geoloc: { lat: 48.86252, lng: 2.4428 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/venues/BNGQ_1687856996',
    info: 'MONTREUIL',
    label: 'THEATRE PUBLIC DE MONTREUIL',
    postalCode: '93100',
    venueId: 2893,
    venue_type: null,
    isOpenToPublic: true,
  },
]

describe('getVenuesNumberByType', () => {
  it('should return venues number by type', () => {
    const venuesNumberByType = getVenuesNumberByType(venues)

    expect(venuesNumberByType).toEqual({
      [VenueTypeCodeKey.BOOKSTORE]: 1,
      [VenueTypeCodeKey.MUSEUM]: 2,
    })
  })
})
