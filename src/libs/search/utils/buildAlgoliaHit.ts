import { ResultItem } from '@elastic/app-search-javascript'

import { CategoryNameEnum } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { SuggestedPlace } from 'libs/place'
import { AppSearchFields, TRUE } from 'libs/search/filters/constants'

// TODO(antoinewg) We need this function temporarily but delete when we migrate completely to App Search
export const buildAlgoliaHit = (searchHit: ResultItem<AppSearchFields>): AlgoliaHit => {
  const dates = (searchHit.getRaw(AppSearchFields.dates) as string[]).map(
    (ts: string) => new Date(ts).getTime() / 1000
  )
  const prices = (searchHit.getRaw(AppSearchFields.prices) as string[]).map((p: string) => +p / 100)
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

export const buildVenues = (searchHit: ResultItem<AppSearchFields>): SuggestedPlace => {
  const geoloc = searchHit.getRaw(AppSearchFields.venue_position) as string
  const [lat, lng] = (geoloc || ',').split(',')
  const latitude = isNaN(parseFloat(lat)) ? null : parseFloat(lat)
  const longitude = isNaN(parseFloat(lng)) ? null : parseFloat(lng)

  const venueId = searchHit.getRaw(AppSearchFields.venue_id) as string

  return {
    label: searchHit.getRaw(AppSearchFields.venue_name) as string,
    info: searchHit.getRaw(AppSearchFields.offerer_name) as string,
    geolocation: latitude && longitude ? { latitude, longitude } : null,
    venueId: isNaN(parseFloat(venueId)) ? null : parseFloat(venueId),
  }
}
