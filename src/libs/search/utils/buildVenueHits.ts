import { ResultItem } from '@elastic/app-search-javascript'

import { VenueTypeCode } from 'api/gen'
import { VenueHit } from 'libs/search'
import { AppSearchVenuesFields } from 'libs/search/filters/constants'

export const buildVenueHits = (
  searchHit: ResultItem<AppSearchVenuesFields>
): Pick<VenueHit, 'id' | 'name' | 'position' | 'venueType' | 'description'> => {
  const geoloc = searchHit.getRaw(AppSearchVenuesFields.position) as string
  const [lat, lng] = (geoloc || ',').split(',')

  const position = {
    lat: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
    lng: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
  }

  return {
    id: searchHit.getRaw(AppSearchVenuesFields.id) as string,
    name: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    venueType: searchHit.getRaw(AppSearchVenuesFields.venue_type) as VenueTypeCode,
    description: searchHit.getRaw(AppSearchVenuesFields.description) as string,
    position,
  }
}
