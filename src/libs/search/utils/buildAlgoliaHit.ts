import { ResultItem } from '@elastic/app-search-javascript'

import { SubcategoryIdEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { AppSearchFields, TRUE } from 'libs/search/filters/constants'

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

  // Offers are stored in engines grouped by a meta-engine. Thus their ids are `offers-2|9234`.
  const id = searchHit.getRaw(AppSearchFields.id) as string
  const objectID = id.split('|').slice(-1)[0]

  return {
    offer: {
      dates,
      isDigital: +searchHit.getRaw(AppSearchFields.is_digital) === TRUE,
      isDuo: +searchHit.getRaw(AppSearchFields.is_duo) === TRUE,
      name: searchHit.getRaw(AppSearchFields.name) as string,
      prices,
      subcategoryId: searchHit.getRaw(AppSearchFields.subcategory_id) as SubcategoryIdEnum,
      thumbUrl: searchHit.getRaw(AppSearchFields.thumb_url) as string,
    },
    _geoloc: {
      lat: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
      lng: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
    },
    objectID,
  }
}
