import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferHeader } from 'features/offer/components'
import { OfferWebHead } from 'features/offer/pages/OfferWebHead/OfferWebHead'
import { useCtaWordingAndAction } from 'features/offer/services/useCtaWordingAndAction'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { A } from 'ui/web/link/A'

import { OfferBody } from './OfferBody'

export const Offer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params && route.params.id

  const { bottom } = useCustomSafeInsets()
  const { data: offerResponse } = useOffer({ offerId })
  const {
    visible: bookingOfferModalIsVisible,
    showModal: showBookingOfferModal,
    hideModal: dismissBookingOfferModal,
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
    isExternal,
    url,
  } = useCtaWordingAndAction({ offerId }) || {}

  if (!offerResponse) return <React.Fragment></React.Fragment>

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
        <CallToActionContainer testID="CTA-button" style={{ paddingBottom: bottom }}>
          <StyledA href={isExternal ? url : undefined}>
            <ButtonWithLinearGradient
              wording={wording}
              onPress={() => {
                onPressCTA && onPressCTA()
                if (!isExternal) {
                  showBookingOfferModal()
                }
              }}
              isExternal={isExternal}
              isDisabled={onPressCTA === undefined}
            />
          </StyledA>
        </CallToActionContainer>
      )}

      <BookingOfferModal
        visible={bookingOfferModalIsVisible}
        dismissModal={dismissBookingOfferModal}
        offerId={offerResponse.id}
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
  marginBottom: getSpacing(8),
})

const StyledA = webStyled(A)({
  display: 'flex',
  flexDirection: 'column',
})
