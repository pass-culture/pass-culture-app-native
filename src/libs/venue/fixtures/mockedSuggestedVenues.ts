import { VenueTypeCodeKey } from 'api/gen'
import { Venue } from 'features/venue/types'

export const mockedSuggestedVenues: Venue[] = [
  {
    label: 'Le Petit Rintintin 1',
    info: 'Musée, Paris',
    venueId: 5543,
    _geoloc: { lng: -52.669736, lat: 5.16186 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    postalCode: '75014',
    venue_type: VenueTypeCodeKey.MOVIE,
  },
  {
    label: 'Le Petit Rintintin 2',
    info: 'Musée, Paris',
    venueId: 5544,
    _geoloc: { lng: -52.669736, lat: 5.18186 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    postalCode: '75014',
    venue_type: VenueTypeCodeKey.MOVIE,
  },
  {
    label: 'Le Petit Rintintin "',
    info: 'Musée, Paris',
    venueId: 5545,
    _geoloc: { lng: -52.669736, lat: 5.20186 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    postalCode: '75014',
    venue_type: VenueTypeCodeKey.MOVIE,
  },
]
