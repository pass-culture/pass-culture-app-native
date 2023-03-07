import { GenreType } from 'api/gen'

export interface RecommendedIdsResponse {
  playlist_recommended_offers: string[]
  params: {
    reco_origin?: string
    model_name?: string
    model_version?: string
    geo_located?: boolean
    ab_test?: string
    filtered?: boolean
  }
}

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
