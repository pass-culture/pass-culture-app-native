import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { VENUE_CTA_HEIGHT_IN_SPACES } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { VideoSection } from 'features/venue/components/VideoSection/VideoSection'
import { VIDEO_SEEN_STORAGE_KEY } from 'features/venue/constants'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import Animated, { FadeOut, Layout } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { gtlPlaylists } = useGTLPlaylists({ venue, queryKey: 'VENUE_GTL_PLAYLISTS' })
  const { data: venueOffers } = useVenueOffers(venue)
  const isVideoFeatureFlagActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE)
  const { isDesktopViewport } = useTheme()

  const [videoAlreadySeen, setVideoAlreadySeen] = useState<boolean>()
  const { showModal } = useModal()

  const handleVideoFakeDoorClose = () => {
    setVideoAlreadySeen(true)
    storage.saveString(VIDEO_SEEN_STORAGE_KEY, 'true')
  }
  const handlePressVideo = () => {
    showModal()
    analytics.logConsultVenueVideoFakeDoor({ venueType: venue?.venueTypeCode })
  }

  useEffect(() => {
    const getStoredValue = async () => {
      const value = await storage.readString(VIDEO_SEEN_STORAGE_KEY)
      setVideoAlreadySeen(Boolean(value))
    }
    getStoredValue()
  }, [])

  useEffect(() => {
    if ((params.from === 'deeplink' || params.from === 'venueMap') && venue?.id) {
      analytics.logConsultVenue({ venueId: venue.id, from: params.from })
    }
  }, [params.from, venue?.id])

  const isCTADisplayed =
    venue?.venueTypeCode !== VenueTypeCodeKey.MOVIE &&
    ((venueOffers && venueOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0))

  if (!venue) return null

  return videoAlreadySeen === undefined ? null : (
    <OfferCTAProvider>
      <VenueContent venue={venue} onCloseVideoFakeDoor={handleVideoFakeDoorClose} isCTADisplayed>
        <VenueTopComponent venue={venue} />
        <ViewGap gap={isDesktopViewport ? 10 : 6}>
          {isVideoFeatureFlagActive && !videoAlreadySeen ? (
            <Animated.View exiting={FadeOut.duration(200)}>
              <VideoSection venueType={venue.venueTypeCode} onPress={handlePressVideo} />
            </Animated.View>
          ) : null}
          <Animated.View layout={Layout.duration(200)}>
            <VenueBody venue={venue} playlists={gtlPlaylists} venueOffers={venueOffers} />

            <VenueThematicSection venue={venue} />

            <VenueMessagingApps venue={venue} />

            <EmptyBottomSection isVisible={!!isCTADisplayed} />
          </Animated.View>
        </ViewGap>
      </VenueContent>
    </OfferCTAProvider>
  )
}

const EmptyBottomSection = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <SectionWithDivider visible={isVisible} gap={VENUE_CTA_HEIGHT_IN_SPACES}>
      <EmptySectionContainer />
    </SectionWithDivider>
  )
}

const EmptySectionContainer = styled.View(({ theme }) => ({
  marginBottom: getSpacing(6),
}))
