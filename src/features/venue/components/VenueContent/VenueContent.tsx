import React, { useCallback, useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import Animated, { FadeOut, Layout } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { VenueWebMetaHeader } from 'features/venue/components/VenueWebMetaHeader'
import { VideoSection } from 'features/venue/components/VideoSection/VideoSection'
import { VENUE_VIDEO_FAKEDOOR_DATA } from 'features/venue/constants'
import { VenueOffers, VenueOffersArtists } from 'features/venue/types'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { Spacer } from 'ui/theme'

type Props = {
  venue: VenueResponse
  gtlPlaylists?: GtlPlaylistData[]
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffers
  videoSectionVisible?: boolean
  onCloseVideoFakeDoor?: () => void
}

const trackEventHasSeenVenueForSurvey = () =>
  BatchProfile.trackEvent(BatchEvent.hasSeenVenueForSurvey)
const isWeb = Platform.OS === 'web'

export const VenueContent: React.FunctionComponent<Props> = ({
  venue,
  gtlPlaylists,
  venueArtists,
  venueOffers,
  videoSectionVisible,
  onCloseVideoFakeDoor,
}) => {
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)
  const { showAccessScreeningButton } = useRemoteConfigContext()

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
  const { visible, hideModal, showModal } = useModal()
  const { isButtonVisible, wording } = useOfferCTA()
  const closeModal = () => {
    onCloseVideoFakeDoor?.()
    hideModal()
  }

  const handlePressVideo = () => {
    showModal()
    analytics.logConsultVenueVideoFakeDoor({ venueType: venue.venueTypeCode })
  }

  const buildSurveyURL = () => {
    const urlOrigin = VENUE_VIDEO_FAKEDOOR_DATA.surveyURL

    if (venue.venueTypeCode) {
      return `${urlOrigin}?VenueType=${venue.venueTypeCode}`
    }
    return urlOrigin
  }

  const shouldDisplayCTA =
    venue.venueTypeCode !== VenueTypeCodeKey.MOVIE &&
    ((venueOffers && venueOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0))

  const renderVenueCTA = useCallback(() => {
    if (showAccessScreeningButton && wording.length) {
      return isButtonVisible ? <CineContentCTA /> : null
    }
    return shouldDisplayCTA ? <VenueCTA venue={venue} /> : null
  }, [isButtonVisible, shouldDisplayCTA, showAccessScreeningButton, venue, wording.length])

  return (
    <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
      <SurveyModal
        Icon={BicolorCircledClock}
        hideModal={closeModal}
        visible={visible}
        title={VENUE_VIDEO_FAKEDOOR_DATA.title}
        surveyDescription={VENUE_VIDEO_FAKEDOOR_DATA.description}
        surveyUrl={buildSurveyURL()}
      />
      <Container>
        <VenueWebMetaHeader venue={venue} />
        {/* On web VenueHeader is called before Body for accessibility navigate order */}
        {isWeb ? <VenueHeader headerTransition={headerTransition} venue={venue} /> : null}
        <ContentContainer
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          ref={scrollViewRef}>
          {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
          <VenueTopComponent venue={venue} />
          <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
          {videoSectionVisible ? (
            <Animated.View exiting={FadeOut.duration(200)}>
              <VideoSection venueType={venue.venueTypeCode} onPress={handlePressVideo} />
            </Animated.View>
          ) : null}
          <Animated.View layout={Layout.duration(200)}>
            <VenueBody
              venue={venue}
              playlists={gtlPlaylists}
              venueArtists={venueArtists}
              venueOffers={venueOffers}
              shouldDisplayCTA={shouldDisplayCTA}
            />
          </Animated.View>
        </ContentContainer>
        {/* On native VenueHeader is called after Body to implement the BlurView for iOS */}
        {isWeb ? null : <VenueHeader headerTransition={headerTransition} venue={venue} />}
        {renderVenueCTA()}
      </Container>
    </AnchorProvider>
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
