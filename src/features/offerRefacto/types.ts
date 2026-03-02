import { ComponentType, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { Animated, ViewToken } from 'react-native'

import {
  OfferArtist,
  OfferResponse,
  RecommendationApiParams,
  SearchGroupResponseModelv2,
} from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { ShareContent } from 'libs/share/types'
import { Subcategory } from 'libs/subcategories/types'
import { Offer } from 'shared/offer/types'
import { ImageWithCredit } from 'shared/types'

export type HasEnoughCreditType =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }

export type ArtistsLine = {
  prefix: string
  artists: OfferArtist[]
}

export type UseOfferHeaderParams = {
  offer: OfferResponse
  headerTransition: Animated.AnimatedInterpolation<string | number>
}

export type OfferHeaderViewModel = {
  title: string
  shareModal: {
    isVisible: boolean
    content: ShareContent | null
    title: string
  }
  onBackPress: () => void
  onSharePress: () => void
  onDismissShareModal: () => void
}

export type OfferHeaderViewProps = {
  viewModel: OfferHeaderViewModel
  headerTransition: Animated.AnimatedInterpolation<string | number>
  children?: ReactNode
}

// OfferBody types

export type UseOfferBodyParams = {
  offer: OfferResponse
  subcategory: Subcategory
  searchGroupList: SearchGroupResponseModelv2[]
  userId?: number
}

type ImageContainerDimensions = {
  backgroundHeight: number
  imageStyle: {
    height: number
    width: number
    maxWidth: number
    aspectRatio: number
    borderRadius: number
  }
}

export type OfferBodyViewModel = {
  offerImages: ImageWithCredit[]
  placeholderImage: string | undefined
  imageDimensions: ImageContainerDimensions
  distance: string | null
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  onSeeMoreButtonPress: (chronicleId: number) => void
  onSeeAllReviewsPress: () => void
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
}

export type OfferBodyComponentProps = {
  offer: OfferResponse
  subcategory: Subcategory
  searchGroupList: SearchGroupResponseModelv2[]
  chronicles?: ChronicleCardData[]
  chronicleVariantInfo: ChronicleVariantInfo
  headlineOffersCount?: number
  isVideoSectionEnabled?: boolean
  hasVideoCookiesConsent?: boolean
  onVideoConsentPress?: () => void
  isMultiArtistsEnabled?: boolean
  onShowOfferArtistsModal: (artists: OfferArtist[]) => void
  onShowChroniclesWritersModal: () => void
  onOfferPreviewPress: (index?: number) => void
  userId?: number
  BodyWrapper: ComponentType<PropsWithChildren>
  desktopCTAs?: ReactElement | null
  children?: ReactNode
}

export type OfferBodyViewProps = OfferBodyComponentProps & {
  viewModel: OfferBodyViewModel
}
