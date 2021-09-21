import { ResultItem } from '@elastic/app-search-javascript'

import { VenueTypeCode } from 'api/gen'
import { VenueHit } from 'libs/search'
import { AppSearchVenuesFields } from 'libs/search/filters/constants'

export const buildVenueHits = (searchHit: ResultItem<AppSearchVenuesFields>): VenueHit => {
  const geoloc = searchHit.getRaw(AppSearchVenuesFields.position) as string
  const [lat, lng] = (geoloc || ',').split(',')

  return {
    // @ts-ignore : TODO (Lucasbeneston) How to select only id, name, venueType and Geoloc ?
    venue: {
      id: searchHit.getRaw(AppSearchVenuesFields.id) as string,
      name: searchHit.getRaw(AppSearchVenuesFields.name) as string,
      venueType: searchHit.getRaw(AppSearchVenuesFields.venue_type) as VenueTypeCode,
    },
    _geoloc: {
      lat: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
      lng: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
    },
  }
}
