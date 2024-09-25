import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { PoiHeader } from 'features/poi/components/PoiHeader/PoiHeader'
import { PoiWebMetaHeader } from 'features/poi/components/PoiWebMetaHeader'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer } from 'ui/theme'

type Props = {
  poi: VenueResponse
  gtlPlaylists?: GtlPlaylistData[]
  poiOffers?: VenueOffers
  videoSectionVisible?: boolean
}

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)
const isWeb = Platform.OS === 'web'

export const PoiContent: React.FunctionComponent<Props> = ({ poi, gtlPlaylists, poiOffers }) => {
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

  const shouldDisplayCTA =
    (poiOffers && poiOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0)

  return (
    <Fragment>
      <Container>
        <PoiWebMetaHeader poi={poi} />
        {/* On web VenueHeader is called before Body for accessibility navigate order */}
        <PoiHeader headerTransition={headerTransition} venue={poi} />
        <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
          <ContentContainer
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
            ref={scrollViewRef}>
            {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
            <VenueTopComponent venue={poi} />
            <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
            <VenueBody
              venue={poi}
              playlists={gtlPlaylists}
              venueOffers={poiOffers}
              shouldDisplayCTA={shouldDisplayCTA}
            />
          </ContentContainer>
        </AnchorProvider>
        {/* On native VenueHeader is called after Body to implement the BlurView for iOS */}
        {isWeb ? null : <VenueHeader headerTransition={headerTransition} venue={poi} />}
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
