import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { OfferWebHead } from 'features/offer/pages/OfferWebHead/OfferWebHead'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { useOffer } from '../api/useOffer'
import { OfferHeader } from '../components'
import { useCtaWordingAndAction } from '../services/useCtaWordingAndAction'
import { useFunctionOnce } from '../services/useFunctionOnce'

import { OfferBody } from './OfferBody'

export const Offer: FunctionComponent = () => {
  const { bottom } = useCustomSafeInsets()
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const { data: offerResponse } = useOffer({ offerId: params.id })
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

  const { wording, onPress: onPressCTA, isExternal } =
    useCtaWordingAndAction({ offerId: params.id }) || {}

  if (!offerResponse) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <OfferWebHead offer={offerResponse} />
      <OfferBody offerId={params.id} onScroll={onScroll} />
      {wording ? (
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
      ) : (
        <Spacer.Column numberOfSpaces={10} />
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
