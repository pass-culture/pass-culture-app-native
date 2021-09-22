import { ResultItem } from '@elastic/app-search-javascript'

import { CategoryNameEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { AppSearchFields, AppSearchVenuesFields, TRUE } from 'libs/search/filters/constants'
import { SuggestedVenue } from 'libs/venue'

const parseArray = (
  searchHit: ResultItem<AppSearchFields>,
  field: AppSearchFields
): Array<string> => {
  const raw = searchHit.getRaw(field)
  return Array.isArray(raw) ? raw : []
}

// TODO(antoinewg) We need this function temporarily but delete when we migrate completely to App Search
export const buildAlgoliaHit = (searchHit: ResultItem<AppSearchFields>): AlgoliaHit => {
  const dates = parseArray(searchHit, AppSearchFields.dates).map(
    (ts: string) => new Date(ts).getTime() / 1000
  )
  const prices = parseArray(searchHit, AppSearchFields.prices).map((p: string) => +p / 100)
  const geoloc = searchHit.getRaw(AppSearchFields.venue_position) as string
  const [lat, lng] = (geoloc || ',').split(',')

  return {
    offer: {
      category: searchHit.getRaw(AppSearchFields.category) as CategoryNameEnum,
      dates,
      description: searchHit.getRaw(AppSearchFields.description) as string,
      isDigital: +searchHit.getRaw(AppSearchFields.is_digital) === TRUE,
      isDuo: +searchHit.getRaw(AppSearchFields.is_duo) === TRUE,
      name: searchHit.getRaw(AppSearchFields.name) as string,
      prices,
      thumbUrl: searchHit.getRaw(AppSearchFields.thumb_url) as string,
    },
    _geoloc: {
      lat: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
      lng: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
    },
    objectID: searchHit.getRaw(AppSearchFields.id) as string,
  }
}

export const buildVenues = (searchHit: ResultItem<AppSearchVenuesFields>): SuggestedVenue => {
  const venueId = searchHit.getRaw(AppSearchVenuesFields.id) as string

  return {
    label: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    info: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    venueId: isNaN(parseFloat(venueId)) ? null : parseFloat(venueId),
  }
}
