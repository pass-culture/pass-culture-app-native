import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
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
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer } from 'ui/theme'

export const Offer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const trackEventHasSeenOffer = useFunctionOnce(
    useCallback(() => BatchUser.trackEvent(BatchEvent.hasSeenOffer), [])
  )
  const offerId = route.params && route.params.id

  const { data: offerResponse } = useOffer({ offerId })

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })

  const { data: offer } = useOffer({ offerId })
  const similarOffers = useSimilarOffers(offerId, offer?.venue.coordinates)
  const hasSimilarOffers = similarOffers && similarOffers.length > 0
  const fromOfferId = route.params?.fromOfferId

  const logSimilarOfferPlaylistVerticalScroll = useFunctionOnce(() => {
    if (hasSimilarOffers) {
      return analytics.logSimilarOfferPlaylistVerticalScroll(fromOfferId)
    }
  })

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
      }
      // The log event is triggered when the similar offer playlist is visible
      if (isCloseToBottom({ ...nativeEvent, padding: 300 })) {
        logSimilarOfferPlaylistVerticalScroll()
      }
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

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useOfferModal({
    modalToDisplay,
    offerId,
    isEndedUsedBooking,
  })

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOffer()
      if (route.params.openModalOnNavigation) {
        showOfferModal?.()
      }
    }, [trackEventHasSeenOffer, route.params.openModalOnNavigation, showOfferModal])
  )

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
            <CTAButton
              wording={wording}
              onPress={onPress}
              navigateTo={navigateTo}
              externalNav={externalNav}
              isDisabled={isDisabled}
            />
            <Spacer.Column numberOfSpaces={bottomBannerText ? 4.5 : 6} />
          </CallToActionContainer>
          {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
        </React.Fragment>
      )}

      {CTAOfferModal}
    </Container>
  )
}

const CTAButton = ({
  wording,
  onPress,
  isDisabled,
  externalNav,
  navigateTo,
}: {
  wording: string
  onPress?: () => void
  isDisabled?: boolean
  externalNav?: ExternalNavigationProps['externalNav']
  navigateTo?: InternalNavigationProps['navigateTo']
}) => {
  const commonLinkProps = {
    as: ButtonWithLinearGradient,
    wording: wording,
    onBeforeNavigate: onPress,
    isDisabled: isDisabled,
    isOnPressDebounced: true,
  }

  if (navigateTo) {
    return <InternalTouchableLink navigateTo={navigateTo} {...commonLinkProps} />
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink externalNav={externalNav} icon={ExternalSite} {...commonLinkProps} />
    )
  }
  return <ButtonWithLinearGradient wording={wording} onPress={onPress} isDisabled={isDisabled} />
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
