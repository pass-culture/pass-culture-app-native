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
  start_date?: string
  end_date?: string
  isEvent?: boolean
  categories?: string[]
  price_max?: number
  subcategories?: string[]
  isDuo?: boolean
  isRecoShuffled?: boolean
}
