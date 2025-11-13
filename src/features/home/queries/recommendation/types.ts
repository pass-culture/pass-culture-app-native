import { GenreType } from 'api/gen'

export interface RecommendedIdsRequest {
  endpointUrl: string
  start_date?: string
  end_date?: string
  isEvent?: boolean
  categories?: string[]
  price_min?: number
  price_max?: number
  subcategories?: string[]
  isDuo?: boolean
  isRecoShuffled?: boolean
  offerTypeList?: Array<OfferTypeValue>
}
type OfferTypeValue = { key: GenreType; value: string }
