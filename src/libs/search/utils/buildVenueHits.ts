import { ResultItem } from '@elastic/app-search-javascript'

import { VenueHit } from 'libs/search'
import { AppSearchVenuesFields } from 'libs/search/filters/constants'

export const buildVenueHits = (
  searchHit: ResultItem<AppSearchVenuesFields>
): Pick<VenueHit, 'id' | 'name' | 'venueType'> => {
  return {
    id: searchHit.getRaw(AppSearchVenuesFields.id) as string,
    name: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    venueType: searchHit.getRaw(AppSearchVenuesFields.venue_type) as string,
  }
}
