import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueBodyNew } from 'features/venue/components/VenueBodyNew/VenueBodyNew'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebHeader } from 'features/venue/components/VenueWebHeader'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { data: venueOffers } = useVenueOffers(params.id)
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

  const gtlPlaylists = useGTLPlaylists({ venue })

  if (!venue) return null

  const hasSomeOffers = (venueOffers && venueOffers.hits.length > 0) || gtlPlaylists?.length > 0

  const shouldDisplayCTA = shouldUseNewVenuePage && hasSomeOffers

  return (
    <Container>
      <VenueWebHeader venue={venue} />
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
      {/* VenueHeader is called after Body to implement the BlurView for iOS */}
      <VenueHeader
        headerTransition={headerTransition}
        title={venue.publicName || venue.name}
        venueId={venue.id}
      />
      {!!shouldDisplayCTA && <VenueCTA venueId={venue.id} />}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
