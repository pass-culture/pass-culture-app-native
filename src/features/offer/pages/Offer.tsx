import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { OfferWebHead } from 'features/offer/pages/OfferWebHead/OfferWebHead'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { useOffer } from '../api/useOffer'
import { OfferHeader } from '../components'
import { useCtaWordingAndAction } from '../services/useCtaWordingAndAction'
import { useFunctionOnce } from '../services/useFunctionOnce'

import { OfferBody } from './OfferBody'

export const Offer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params && route.params.id

  const { bottom } = useCustomSafeInsets()
  const { data: offerResponse } = useOffer({ offerId })
  const [showBookingOfferModal, setShowBookingOfferModal] = useState<boolean>(false)

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

  const { wording, onPress: onPressCTA, isExternal } = useCtaWordingAndAction({ offerId }) || {}

  if (!offerResponse) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <OfferWebHead offer={offerResponse} />
      <OfferBody offerId={offerId} onScroll={onScroll} />
      {!!wording && (
        <CallToActionContainer testID="CTA-button" style={{ paddingBottom: bottom }}>
          <ButtonWithLinearGradient
            wording={wording}
            onPress={() => {
              onPressCTA && onPressCTA()
              if (!isExternal) {
                setShowBookingOfferModal(true)
              }
            }}
            isExternal={isExternal}
            isDisabled={onPressCTA === undefined}
          />
        </CallToActionContainer>
      )}

      <BookingOfferModal
        visible={showBookingOfferModal}
        dismissModal={() => setShowBookingOfferModal(false)}
        offerId={offerResponse.id}
      />

      <OfferHeader
        title={offerResponse.name}
        headerTransition={headerTransition}
        offerId={offerResponse.id}
      />
    </React.Fragment>
  )
}

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginBottom: getSpacing(8),
})
