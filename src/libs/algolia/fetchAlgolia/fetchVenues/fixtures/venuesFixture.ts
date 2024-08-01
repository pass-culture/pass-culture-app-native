import type { ReadonlyDeep } from 'type-fest'

import { VenueTypeCodeKey } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { toMutable } from 'shared/types/toMutable'

export const venuesFixture = toMutable([
  {
    label: 'Cinéma de la fin',
    info: 'Paris',
    venueId: 4197,
    _geoloc: { lat: 48.871728, lng: 2.308157 },
    banner_url: null,
    postalCode: '75000',
    venue_type: VenueTypeCodeKey.VISUAL_ARTS,
  },
  {
    label: 'La librairie quantique',
    info: 'Syndicat des librairies physiques',
    venueId: 4192,
    _geoloc: { lat: 48.84751, lng: 2.34231 },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/venues/CBQA_1678748459',
    postalCode: '',
    venue_type: VenueTypeCodeKey.VISUAL_ARTS,
  },
] as const satisfies ReadonlyDeep<GeolocatedVenue[]>)
