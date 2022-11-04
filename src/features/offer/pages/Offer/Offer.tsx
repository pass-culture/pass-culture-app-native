import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { AuthenticationModal } from 'features/offer/components/AuthenticationModal/AuthenticationModal'
import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferWebHead } from 'features/offer/components/OfferWebHead'
import { OfferModal } from 'features/offer/enums'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { useModal } from 'ui/components/modals/useModal'
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
  const {
    visible: bookingOfferModalIsVisible,
    showModal: showBookingOfferModal,
    hideModal: dismissBookingOfferModal,
  } = useModal(false)
  const {
    visible: authenticationModalVisible,
    showModal: showAuthenticationModal,
    hideModal: hideAuthenticationModal,
  } = useModal(false)

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })

  const { headerTransition, onScroll } = useHeaderTransition({
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

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOffer()
      dismissBookingOfferModal()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dismissBookingOfferModal])
  )

  if (!offerResponse) return <React.Fragment></React.Fragment>

  const externalNavProps = externalNav
    ? { externalNav, isOnPressDebounced: true, icon: ExternalSite }
    : undefined
  const navigationProps = navigateTo ? { navigateTo, isOnPressDebounced: true } : externalNavProps

  const onPress = () => {
    onPressCTA && onPressCTA()
    if (modalToDisplay === OfferModal.BOOKING) {
      showBookingOfferModal()
    }
    if (modalToDisplay === OfferModal.AUTHENTICATION) {
      showAuthenticationModal()
    }
  }

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

      <BookingOfferModal
        visible={bookingOfferModalIsVisible}
        dismissModal={dismissBookingOfferModal}
        offerId={offerResponse.id}
        isEndedUsedBooking={isEndedUsedBooking}
      />
      <AuthenticationModal
        visible={authenticationModalVisible}
        hideModal={hideAuthenticationModal}
      />
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
