import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin, UseRouteType } from 'features/navigation/RootNavigator/types'
import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { Subcategory } from 'libs/subcategories/types'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'

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
  const route = useRoute<UseRouteType<'Offer'>>()
  const from = route.params?.from
  const searchId = route.params?.searchId
  const openModalOnNavigation = route.params?.openModalOnNavigation
  const { isLoggedIn } = useAuthContext()
  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const {
    wording,
    onPress: onPressCTA,
    navigateTo,
    externalNav,
    modalToDisplay,
    isEndedUsedBooking,
    bottomBannerText,
    isDisabled,
  } = useCtaWordingAndAction({ offer, from, searchId, subcategory }) ?? {}

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    isEndedUsedBooking,
    from: StepperOrigin.OFFER,
  })

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (openModalOnNavigation) {
        showOfferModal()
      }
    }, [trackEventHasSeenOfferOnce, openModalOnNavigation, showOfferModal])
  )

  const onPress = () => {
    onPressCTA?.()
    showOfferModal()
  }

  return (
    <React.Fragment>
      <StickyBookingButton
        ctaWordingAndAction={{
          wording,
          onPress,
          navigateTo,
          externalNav,
          isDisabled,
          bottomBannerText,
        }}
        isFreeDigitalOffer={isFreeDigitalOffer}
        isLoggedIn={isLoggedIn}
      />

      {CTAOfferModal}
    </React.Fragment>
  )
}
