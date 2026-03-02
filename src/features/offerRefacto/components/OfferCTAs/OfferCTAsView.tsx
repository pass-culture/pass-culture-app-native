import React from 'react'
import { LayoutChangeEvent, View } from 'react-native'

import { OfferResponse } from 'api/gen'
import { BookingButton } from 'features/offer/components/BookingButton/BookingButton'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { FavoritesCTA } from 'features/offer/components/OfferContent/ComingSoonCTAs/FavoritesCTA'
import { StickyFooterContent } from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContent'
import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { FavoriteCTAProps, OfferCTAsViewModel } from 'features/offerRefacto/types'

type OfferCTAsViewProps = {
  offer: OfferResponse
  favoriteCTAProps: FavoriteCTAProps
  viewModel: OfferCTAsViewModel
  fullScreen?: boolean
  onLayout?: (params: LayoutChangeEvent) => void
}

export const OfferCTAsView = ({
  offer,
  favoriteCTAProps,
  viewModel,
  fullScreen,
  onLayout,
}: Readonly<OfferCTAsViewProps>) => {
  const {
    ctaProps,
    CTAOfferModal,
    favoriteAuthModal,
    reminderAuthModal,
    theme,
    isFreeDigitalOffer,
    hasReminder,
    isLoggedIn,
    isAComingSoonOffer,
    showCineCTA,
  } = viewModel
  const { isDesktopViewport, isMobileViewport } = theme
  const { onFavoritePress, onReminderPress } = ctaProps
  const { favorite, isAddFavoriteLoading, isRemoveFavoriteLoading } = favoriteCTAProps

  if (isAComingSoonOffer) {
    return isDesktopViewport ? (
      <FavoritesCTA
        offerId={offer.id}
        favorite={favorite}
        onPressFavoriteCTA={onFavoritePress}
        isAddFavoriteLoading={isAddFavoriteLoading}
        isRemoveFavoriteLoading={isRemoveFavoriteLoading}
        favoriteAuthModal={favoriteAuthModal}
        caption="Cette offre sera bientôt disponible"
      />
    ) : (
      <StickyFooterContent
        offerId={offer.id}
        favorite={favorite}
        onPressFavoriteCTA={onFavoritePress}
        isAddFavoriteLoading={isAddFavoriteLoading}
        isRemoveFavoriteLoading={isRemoveFavoriteLoading}
        hasReminder={hasReminder}
        onPressReminderCTA={onReminderPress}
        favoriteAuthModal={favoriteAuthModal}
        reminderAuthModal={reminderAuthModal}
        onLayout={onLayout}
      />
    )
  }

  if (isMobileViewport && showCineCTA) {
    return <CineContentCTA />
  }

  const BookingButtonComponent = isDesktopViewport ? BookingButton : StickyBookingButton

  return (
    <View onLayout={onLayout}>
      <BookingButtonComponent
        ctaWordingAndAction={ctaProps}
        isFreeDigitalOffer={isFreeDigitalOffer}
        isLoggedIn={isLoggedIn}
        fullScreen={fullScreen}
      />
      {CTAOfferModal}
    </View>
  )
}
