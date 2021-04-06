import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import styled from 'styled-components/native'

import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { useOffer } from '../api/useOffer'
import { CallToAction, OfferHeader } from '../components'
import { useCtaWordingAndAction } from '../services/useCtaWordingAndAction'
import { useFunctionOnce } from '../services/useFunctionOnce'

import { OfferBody } from './OfferBody'

export const Offer: FunctionComponent = () => {
  const { bottom } = useCustomSafeInsets()
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const { data: offerResponse } = useOffer({ offerId: params.id })
  const headerScroll = useRef(new Animated.Value(0)).current
  const [showBookingOfferModal, setShowBookingOfferModal] = useState<boolean>(false)

  const { wording, onPress: onPressCTA, isExternal } =
    useCtaWordingAndAction({ offerId: params.id }) || {}

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })

  if (!offerResponse) return <React.Fragment></React.Fragment>

  const headerTransition = headerScroll.interpolate(interpolationConfig)

  const checkIfAllPageHaveBeenSeen = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      logConsultWholeOffer()
    }
  }

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
    listener: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) =>
      checkIfAllPageHaveBeenSeen({ nativeEvent }),
  })

  return (
    <React.Fragment>
      <OfferBody offerId={params.id} onScroll={onScroll} />

      {wording ? (
        <CallToActionContainer testID="CTA-button" style={{ paddingBottom: bottom }}>
          <CallToAction
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
