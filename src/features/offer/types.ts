import { ComponentType, PropsWithChildren, ReactNode } from 'react'
import { Animated } from 'react-native'

import {
  CategoryIdEnum,
  FavoriteResponse,
  OfferResponse,
  ReactionTypeEnum,
  RecommendationApiParams,
  SearchGroupResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { Referrals } from 'features/navigation/navigators/RootNavigator/types'
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
  originDetails?: string
  navigationMethod?: NavigationMethod
  interactionTag?: ReactNode
  containerWidth?: number
  withCenterAlign?: boolean
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

type OfferHeaderComponentProps = PropsWithChildren<{
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offer: OfferResponse
}>

export type OfferContentProps = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  adviceVariantInfo?: AdviceVariantInfo
  subcategory: Subcategory
  onShowClubAdviceWritersModal: () => void
  clubAdvices?: AdviceCardData[]
  proAdvices?: AdviceCardData[]
  headlineOffersCount?: number
  defaultReaction?: ReactionTypeEnum | null
  onReactionButtonPress?: () => void
  userId?: number
  hasVideoCookiesConsent?: boolean
  onVideoConsentPress: VoidFunction
  HeaderComponent?: ComponentType<OfferHeaderComponentProps>
  proAdvicesCount?: number
  proAdvicesSegment?: string
}

export type OfferImageContainerDimensions = {
  backgroundHeight: number
  imageStyle: {
    height: number
    width: number
    maxWidth: number
    aspectRatio: number
    borderRadius: number
  }
}

export type Duration = {
  label: string
  accessibilityLabel: string
}

export type AdvicesStatus = {
  total: number
  hasPublished: boolean
  hasUnpublished: boolean
}
