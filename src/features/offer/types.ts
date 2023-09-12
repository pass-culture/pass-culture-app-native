import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'

export interface OfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  venueId?: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  analyticsFrom: Referrals
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
  width: number
  height: number
  fromOfferId?: number
  fromMultivenueOfferId?: number
  shouldUseAlgoliaRecommend?: boolean
  playlistType?: PlaylistType
  searchId?: string
  apiRecoParams?: SimilarOffersResponseParams
}

export interface SimilarOffersResponseParams {
  call_id?: string
  filtered?: boolean
  geo_located?: boolean
  model_endpoint?: string
  model_name?: string
  model_version?: string
  reco_origin?: string
}

export interface SimilarOffersResponse {
  results: string[]
  params: SimilarOffersResponseParams
}

export interface VenueDetail {
  title: string
  address: string
  distance?: string
}
