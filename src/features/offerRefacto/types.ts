import { UseMutateFunction } from '@tanstack/react-query'
import { ReactElement, ReactNode } from 'react'
import { Animated } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import {
  BookOfferRequest,
  BookOfferResponse,
  BookingReponse,
  FavoriteRequest,
  FavoriteResponse,
  OfferArtist,
  OfferResponse,
  RecommendationApiParams,
  SubcategoryResponseModelv2,
  SubscriptionStatus,
  YoungStatusResponse,
} from 'api/gen'
import { FavoriteMutationContext } from 'features/favorites/queries/types'
import { ValidStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { PlaylistType } from 'features/offer/enums'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { EmptyResponse } from 'libs/fetch'
import { ShareContent } from 'libs/share/types'
import { OfferModal } from 'shared/offer/enums'
import { ModalSettings } from 'ui/components/modals/useModal'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

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

type CTAProps = {
  onPress: () => void
  onFavoritePress: () => void
  onReminderPress: () => void
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  isDisabled?: boolean
  bottomBannerText?: string
}

export type FavoriteCTAProps = {
  addFavorite: UseMutateFunction<
    FavoriteResponse,
    Error | ApiError,
    FavoriteRequest,
    FavoriteMutationContext
  >
  isAddFavoriteLoading: boolean
  removeFavorite: UseMutateFunction<EmptyResponse, Error, number, FavoriteMutationContext>
  isRemoveFavoriteLoading: boolean
  favorite?: FavoriteResponse | null
}

export type OfferCTAsViewModel = {
  ctaProps: CTAProps
  CTAOfferModal: ReactElement | null
  theme: DefaultTheme
  isFreeDigitalOffer: boolean
  isAComingSoonOffer: boolean
  isLoggedIn: boolean
  favoriteAuthModal: ModalSettings
  reminderAuthModal: ModalSettings
  hasReminder: boolean
  showCineCTA?: boolean
}

export type CTAContext = {
  offer: OfferResponse
  bookOffer: UseMutateFunction<BookOfferResponse, Error | ApiError, BookOfferRequest>
  isUnderageBeneficiary: boolean
  booking?: BookingReponse | null
  isBookingLoading?: boolean
  from?: Referrals
  searchId?: string
  apiRecoParams?: RecommendationApiParams
  playlistType?: PlaylistType
  subscriptionStatus?: SubscriptionStatus | null
  hasEnoughCreditMessage?: string
  storedProfileInfos?: ValidStoredProfileInfos
  alreadyBookedOfferId?: number
}

export type CTAType =
  | 'AUTHENTICATION'
  | 'BOOK_EVENT_OFFER'
  | 'BOOK_OFFER'
  | 'DIGITAL_OFFER'
  | 'ENDED_USED_BOOKING'
  | 'EXPIRED_CREDIT'
  | 'EXPIRED_OFFER'
  | 'EXTERNAL_URL'
  | 'INCOMPLETE_PROFILE'
  | 'INELIGIBLE'
  | 'INSUFFICIENT_CREDIT'
  | 'SEE_BOOKING'
  | 'SOLD_OUT_OFFER'
  | 'SUBSCRIPTION_STATUS'
  | 'UNDEFINED'
  | 'USER_15_16'

export type CTAWordingAndAction = {
  modalToDisplay?: OfferModal
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  onPress?: () => void
  isEndedUsedBooking?: boolean
  bottomBannerText?: string
  isDisabled?: boolean
  movieScreeningUserData?: MovieScreeningUserData
}

export type GetCTAWordingAndActionProps = {
  context: CTAContext
  enableBookingFreeOfferFifteenSixteen: boolean
  userStatus: YoungStatusResponse
  hasEnoughCredit: boolean
  isLoggedIn: boolean
  subcategory: SubcategoryResponseModelv2
  isEndedUsedBooking?: boolean
  user?: UserProfileResponseWithoutSurvey
}
