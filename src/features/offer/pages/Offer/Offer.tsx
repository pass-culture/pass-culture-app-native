import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferWebHead } from 'features/offer/components/OfferWebHead'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { useOfferModal } from 'features/offer/helpers/useOfferModal/useOfferModal'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer } from 'ui/theme'

export const Offer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const trackEventHasSeenOffer = useFunctionOnce(() =>
    BatchUser.trackEvent(BatchEvent.hasSeenOffer)
  )
  const offerId = route.params && route.params.id

  const { data: offerResponse } = useOffer({ offerId })

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeOffer()
    },
  })

  const {
    wording,
    onPress: onPressCTA,
    navigateTo,
    externalNav,
    modalToDisplay,
    isEndedUsedBooking,
    bottomBannerText,
    isDisabled,
  } = useCtaWordingAndAction({ offerId }) || {}

  const {
    OfferModal: CTAOfferModal,
    showModal: showOfferModal,
    dismissBookingOfferModal,
  } = useOfferModal({
    modalToDisplay,
    offerId,
    isEndedUsedBooking,
  })

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOffer()
      dismissBookingOfferModal && dismissBookingOfferModal()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dismissBookingOfferModal])
  )

  const externalNavProps = externalNav
    ? { externalNav, isOnPressDebounced: true, icon: ExternalSite }
    : undefined
  const navigationProps = navigateTo ? { navigateTo, isOnPressDebounced: true } : externalNavProps

  const onPress = () => {
    onPressCTA && onPressCTA()
    showOfferModal && showOfferModal()
  }

  if (!offerResponse) return null

  return (
    <Container>
      <OfferWebHead offer={offerResponse} />
      <OfferHeader
        title={offerResponse.name}
        headerTransition={headerTransition}
        offerId={offerResponse.id}
      />
      <OfferBody offerId={offerId} onScroll={onScroll} />

      {!!wording && (
        <React.Fragment>
          <CallToActionContainer testID="CTA-button">
            {navigationProps ? (
              <TouchableLink
                as={ButtonWithLinearGradient}
                wording={wording}
                onBeforeNavigate={onPress}
                isDisabled={isDisabled}
                {...navigationProps}
              />
            ) : (
              <ButtonWithLinearGradient
                wording={wording}
                onPress={onPress}
                isDisabled={isDisabled}
              />
            )}
            <Spacer.Column numberOfSpaces={bottomBannerText ? 4.5 : 6} />
          </CallToActionContainer>
          {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
        </React.Fragment>
      )}

      {CTAOfferModal}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
