import { useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { Subcategory } from 'libs/subcategories/types'

type Props = {
  offer: OfferResponse
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
}

export const OfferCTAButton: FunctionComponent<Props> = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
}) => {
  const {
    ctaWordingAndAction,
    showOfferModal,
    CTAOfferModal,
    openModalOnNavigation,
    isUnbookedMovieScreeningOffer,
  } = useOfferCTAButton(offer, subcategory)

  const { isLoggedIn } = useAuthContext()
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (openModalOnNavigation) {
        showOfferModal()
      }
    }, [trackEventHasSeenOfferOnce, openModalOnNavigation, showOfferModal])
  )

  return isUnbookedMovieScreeningOffer ? null : (
    <React.Fragment>
      <StickyBookingButton
        ctaWordingAndAction={ctaWordingAndAction}
        isFreeDigitalOffer={isFreeDigitalOffer}
        isLoggedIn={isLoggedIn}
      />

      {CTAOfferModal}
    </React.Fragment>
  )
}
