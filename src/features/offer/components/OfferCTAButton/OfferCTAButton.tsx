import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin, UseRouteType } from 'features/navigation/RootNavigator/types'
import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { getSpacing, Spacer } from 'ui/theme'

export type OfferCTAButtonProps = {
  offer: OfferResponse
  trackEventHasSeenOfferOnce: VoidFunction
}

export function OfferCTAButton({
  offer,
  trackEventHasSeenOfferOnce,
}: Readonly<OfferCTAButtonProps>) {
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
  } = useCtaWordingAndAction({ offer, from, searchId }) ?? {}

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
      {!!wording && (
        <React.Fragment>
          <CallToActionContainer testID="CTA-button">
            <CTAButton
              wording={wording}
              onPress={onPress}
              navigateTo={navigateTo}
              externalNav={externalNav}
              isDisabled={isDisabled}
              isFreeDigitalOffer={isFreeDigitalOffer}
              isLoggedIn={isLoggedIn}
            />
            <Spacer.Column numberOfSpaces={bottomBannerText ? 4.5 : 6} />
          </CallToActionContainer>
          {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
        </React.Fragment>
      )}

      {CTAOfferModal}
    </React.Fragment>
  )
}

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
