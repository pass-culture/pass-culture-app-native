import { BatchUser } from '@batch.com/react-native-plugin'
import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen/api'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { VenueWebMetaHeader } from 'features/venue/components/VenueWebMetaHeader'
import { VideoSection } from 'features/venue/components/VideoSection/VideoSection'
import { isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

type Props = {
  poi: VenueResponse
  gtlPlaylists?: GtlPlaylistData[]
  poiOffers?: VenueOffers
  videoSectionVisible?: boolean
}

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)

export const PoiContent: React.FunctionComponent<Props> = ({
  poi,
  poiOffers,
  gtlPlaylists,
  videoSectionVisible,
}) => {
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

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
  // const { visible, _hideModal, showModal } = useModal()
  const { showModal } = useModal()

  const shouldDisplayCTA =
    (poiOffers && poiOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0)

  return (
    <Fragment>
      <Container>
        <VenueWebMetaHeader venue={poi} />
        {/* On web VenueHeader is called before Body for accessibility navigate order */}
        <VenueHeader headerTransition={headerTransition} venue={poi} />
        <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
          <ContentContainer
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
            ref={scrollViewRef}>
            {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
            <VenueTopComponent venue={poi} />
            <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
            {videoSectionVisible ? (
              <VideoSection venueType={poi.venueTypeCode} onPress={showModal} />
            ) : null}
            <VenueBody
              venue={poi}
              playlists={gtlPlaylists}
              venueOffers={poiOffers}
              shouldDisplayCTA={shouldDisplayCTA}
            />
          </ContentContainer>
        </AnchorProvider>
        {/* On native VenueHeader is called after Body to implement the BlurView for iOS */}
        {shouldDisplayCTA ? <VenueCTA venue={poi} /> : null}
      </Container>
    </Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
