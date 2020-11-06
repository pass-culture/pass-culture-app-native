import { GeoCoordinates } from 'react-native-geolocation-service'

import { Range } from '../typeHelpers'

type AlgoliaGeolocation = Pick<GeoCoordinates, 'longitude' | 'latitude'>

export interface ParsedAlgoliaParameters {
  hitsPerPage: number | null
  aroundRadius: number | null
  offerCategories: string[]
  tags: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  beginningDatetime: Date | null
  endingDatetime: Date | null
  priceRange: Range<number> | null
  searchAround: boolean
  geolocation: AlgoliaGeolocation | null
}
