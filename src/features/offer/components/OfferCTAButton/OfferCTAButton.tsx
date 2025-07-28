import { useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingButton } from 'features/offer/components/BookingButton/BookingButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { Subcategory } from 'libs/subcategories/types'

type OfferCTAButtonProps = {
  offer: OfferResponseV2
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
}

export const OfferCTAButton: FunctionComponent<OfferCTAButtonProps> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const {
    ctaWordingAndAction,
    showOfferModal,
    CTAOfferModal,
    openModalOnNavigation,
    secondaryCtaWordingAndAction,
    secondaryCTAOfferModal,
  } = useOfferCTAButton(offer, subcategory)

  const { isLoggedIn } = useAuthContext()
  const { isDesktopViewport } = useTheme()
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (openModalOnNavigation) {
        showOfferModal()
      }
    }, [trackEventHasSeenOfferOnce, openModalOnNavigation, showOfferModal])
  )
  return (
    <View>
      {isDesktopViewport ? (
        <BookingButton
          ctaWordingAndAction={ctaWordingAndAction}
          isFreeDigitalOffer={isFreeDigitalOffer}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <StickyBookingButton
          ctaWordingAndAction={ctaWordingAndAction}
          isFreeDigitalOffer={isFreeDigitalOffer}
          isLoggedIn={isLoggedIn}
          secondaryCtaWordingAndAction={secondaryCtaWordingAndAction}
        />
      )}
      {CTAOfferModal}
      {secondaryCTAOfferModal}
    </View>
  )
}
