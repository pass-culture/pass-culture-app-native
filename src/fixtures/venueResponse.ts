import { VenueResponse, VenueTypeCodeKey } from 'api/gen'

export default {
  address: '30 rue saint-andré des arts',
  bannerUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/google_places/26235.jpeg',
  city: 'PARIS 6',
  latitude: 48.8536,
  longitude: 2.34199,
  id: 26235,
  isPermanent: true,
  isOpenToPublic: true,
  name: 'SHELLAC EXPLOITATION',
  postalCode: '75006',
  publicName: 'Cinéma St André des Arts',
  timezone: 'Europe/Paris',
  accessibility: {},
  venueTypeCode: VenueTypeCodeKey.MOVIE,
} satisfies Omit<VenueResponse, 'isVirtual'>
