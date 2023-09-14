import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGTLPlaylists } from 'features/venue/api/useGTLPlaylists'
import { useVenue } from 'features/venue/api/useVenue'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebHeader } from 'features/venue/components/VenueWebHeader'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)
  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        triggerBatch()
      }
    },
  })

  const gtlPlaylistData = useGTLPlaylists()

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

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <Container>
      <VenueWebHeader venue={venue} />
      <VenueBody venueId={params.id} onScroll={onScroll} playlists={gtlPlaylistData} />
      {/* VenueHeader is called after Body to implement the BlurView for iOS */}
      <VenueHeader
        headerTransition={headerTransition}
        title={venue.publicName || venue.name}
        venueId={venue.id}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
