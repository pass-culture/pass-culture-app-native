import { ResultItem } from '@elastic/app-search-javascript'

import { CategoryNameEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { AppSearchFields } from 'libs/search/filters/constants'

export const buildAlgoliaHit = (searchHit: ResultItem<AppSearchFields>): AlgoliaHit => {
  const dates = (searchHit.getRaw(AppSearchFields.dates) as string[]).map((ts: string) => +ts)
  const prices = (searchHit.getRaw(AppSearchFields.prices) as string[]).map(
    (price: string) => +price / 100
  )
  const geoloc = searchHit.getRaw(AppSearchFields.geoloc)
  const [lat, lng] = ((geoloc as string) || ', ').split(', ')

  return {
    offer: {
      category: searchHit.getRaw(AppSearchFields.category) as CategoryNameEnum,
      dates,
      description: searchHit.getRaw(AppSearchFields.description) as string,
      isDigital: searchHit.getRaw(AppSearchFields.is_digital) === 'true',
      isDuo: searchHit.getRaw(AppSearchFields.is_duo) === 'true',
      name: searchHit.getRaw(AppSearchFields.name) as string,
      prices,
      thumbUrl: searchHit.getRaw(AppSearchFields.thumb_url) as string,
    },
    _geoloc: {
      lat: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
      lng: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
    },
    objectID: searchHit.getRaw(AppSearchFields.object_id) as string,
  }
}
