import { Activity } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'

export const geolocatedVenuesFixture: GeolocatedVenue[] = [
  {
    _geoloc: { lat: 48.8639905, lng: 2.2965215 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/venues/BJCA_1683275992',
    info: 'PARIS 16',
    label: 'Palais de Tokyo',
    postalCode: '75116',
    venueId: 2628,
    activity: Activity.MUSEUM,
    isOpenToPublic: true,
    isPermanent: true,
  },
  {
    _geoloc: { lat: 48.8829762, lng: 2.3076797 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/venues/CUHQ_1682432163',
    info: 'Paris',
    label: 'Musée Jean-Jacques Henner',
    postalCode: '75017',
    venueId: 5391,
    activity: Activity.MUSEUM,
    isOpenToPublic: true,
    isPermanent: true,
  },
]
