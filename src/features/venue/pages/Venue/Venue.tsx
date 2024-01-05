import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueBodyNew } from 'features/venue/components/VenueBodyNew/VenueBodyNew'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebMetaHeader } from 'features/venue/components/VenueWebMetaHeader'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)

const isWeb = Platform.OS === 'web'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const gtlPlaylists = useGTLPlaylists({ venue })
  const { data: venueOffers } = useVenueOffers(venue)
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)
  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        triggerBatch()
      }
    },
  })
  const shouldUseNewVenuePage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VENUE_PAGE)

  useEffect(() => {
    if (params.from === 'deeplink' && venue?.id) {
      analytics.logConsultVenue({ venueId: venue.id, from: params.from })
    }
  }, [params.from, venue?.id])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      triggerBatch()
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [triggerBatch])

  if (!venue) return null

  const hasSomeOffers = (venueOffers && venueOffers.hits.length > 0) || gtlPlaylists?.length > 0

  const shouldDisplayCTA = shouldUseNewVenuePage && hasSomeOffers

  return (
    <Container>
      <VenueWebMetaHeader venue={venue} />
      {/* On web VenueHeader is called before Body for accessibility navigate order */}
      {isWeb ? (
        <VenueHeader
          headerTransition={headerTransition}
          title={venue.publicName || venue.name}
          venue={venue}
        />
      ) : null}
      {shouldUseNewVenuePage ? (
        <VenueBodyNew
          venue={venue}
          onScroll={onScroll}
          playlists={gtlPlaylists}
          venueOffers={venueOffers}
        />
      ) : (
        <VenueBody venueId={params.id} onScroll={onScroll} playlists={gtlPlaylists} />
      )}
      {/* On native VenueHeader is called after Body to implement the BlurView for iOS */}
      {!isWeb ? (
        <VenueHeader
          headerTransition={headerTransition}
          title={venue.publicName || venue.name}
          venue={venue}
        />
      ) : null}
      {!!shouldDisplayCTA && <VenueCTA venue={venue} />}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
