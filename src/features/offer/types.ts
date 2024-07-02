import { SharedValue } from 'react-native-reanimated'

import {
  CategoryIdEnum,
  OfferResponseV2,
  RecommendationApiParams,
  SearchGroupResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { Subcategory } from 'libs/subcategories/types'

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
  playlistType?: PlaylistType
  searchId?: string
  apiRecoParams?: RecommendationApiParams
  index?: number
  variant?: 'default' | 'new'
}

export interface SimilarOffersResponse {
  results: string[]
  params: RecommendationApiParams
}

export interface VenueDetail {
  title: string
  address: string
  distance?: string
}

export type OfferImageCarouselPaginationProps = {
  progressValue: SharedValue<number>
  offerImages: string[]
  handlePressButton: (direction: 1 | -1) => void
}

export type OfferContentProps = {
  offer: OfferResponseV2
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}
