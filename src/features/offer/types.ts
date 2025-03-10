import { SharedValue } from 'react-native-reanimated'

import {
  CategoryIdEnum,
  FavoriteResponse,
  OfferResponseV2,
  RecommendationApiParams,
  SearchGroupResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaGeoloc } from 'libs/algolia/types'
import { Subcategory } from 'libs/subcategories/types'
import { NAVIGATION_METHOD } from 'shared/constants'

type ValueOf<T> = T[keyof T]
type NavigationMethod = ValueOf<typeof NAVIGATION_METHOD>

export interface OfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  offerLocation: AlgoliaGeoloc
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  venueId?: number
  price: string
  thumbUrl?: string
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
  artistName?: string
  navigationMethod?: NavigationMethod
}

export type FavoriteProps = {
  addFavorite: ({ offerId }: { offerId: number }) => void
  isAddFavoriteLoading: boolean
  removeFavorite: (id: number) => void
  isRemoveFavoriteLoading: boolean
  favorite?: FavoriteResponse | null
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
  chronicles?: ChronicleCardData[]
}
