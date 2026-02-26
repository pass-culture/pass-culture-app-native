import { UseMutateFunction } from '@tanstack/react-query'
import { ReactElement, ReactNode } from 'react'
import { Animated } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import {
  FavoriteRequest,
  FavoriteResponse,
  OfferArtist,
  OfferResponse,
  ReminderResponse,
} from 'api/gen'
import { FavoriteMutationContext } from 'features/favorites/queries/types'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'
import { EmptyResponse } from 'libs/fetch'
import { ShareContent } from 'libs/share/types'
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
  showCineCTA?: boolean
  reminder?: ReminderResponse
  movieScreeningUserData?: MovieScreeningUserData
}
