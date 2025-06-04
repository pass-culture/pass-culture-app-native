import React, { useCallback, useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { VenueHeaderWrapper } from 'features/venue/components/VenueContent/VenueHeaderWrapper'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebMetaHeader } from 'features/venue/components/VenueWebMetaHeader'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

type Props = {
  venue: VenueResponse
  isCTADisplayed?: boolean
  children: React.ReactNode
}

const trackEventHasSeenVenueForSurvey = () =>
  BatchProfile.trackEvent(BatchEvent.hasSeenVenueForSurvey)

export const VenueContent: React.FunctionComponent<Props> = ({
  venue,
  isCTADisplayed,
  children,
}) => {
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)
  const { showAccessScreeningButton } = useRemoteConfigQuery()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      triggerBatch()
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [triggerBatch])

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        triggerBatch()
      }
    },
  })

  const handleCheckScrollY = () => {
    return scrollYRef.current
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(event)
      scrollYRef.current = event.nativeEvent.contentOffset.y
    },
    [onScroll]
  )

  const { isDesktopViewport, isTabletViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const isLargeScreen = isDesktopViewport || isTabletViewport
  const { isButtonVisible, wording } = useOfferCTA()
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)

  const renderVenueCTA = useCallback(() => {
    if (showAccessScreeningButton && wording.length) {
      return isButtonVisible ? <CineContentCTA /> : null
    }
    return isCTADisplayed ? (
      <VenueCTA
        searchNavConfig={searchNavConfig}
        onBeforeNavigate={() => analytics.logVenueSeeAllOffersClicked(venue.id)}
      />
    ) : null
  }, [
    isButtonVisible,
    isCTADisplayed,
    showAccessScreeningButton,
    venue.id,
    wording.length,
    searchNavConfig,
  ])

  return (
    <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
      <Container>
        <VenueWebMetaHeader title={venue.name} description={venue.description} />
        <VenueHeaderWrapper
          header={<VenueHeader headerTransition={headerTransition} venue={venue} />}>
          <ContentContainer
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
            ref={scrollViewRef}>
            {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
            {children}
          </ContentContainer>
        </VenueHeaderWrapper>
        {renderVenueCTA()}
      </Container>
    </AnchorProvider>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
}))

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})
const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
