import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebMetaHeader } from 'features/venue/components/VenueWebMetaHeader'
import { isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

type Props = {
  venue: VenueResponse
  gtlPlaylists?: GtlPlaylistData[]
  venueOffers?: VenueOffers
}

const trackEventHasSeenVenueForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenVenueForSurvey)
const isWeb = Platform.OS === 'web'

export const VenueContent: React.FunctionComponent<Props> = ({
  venue,
  gtlPlaylists,
  venueOffers,
}) => {
  const triggerBatch = useFunctionOnce(trackEventHasSeenVenueForSurvey)

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

  const shouldDisplayCTA =
    (venueOffers && venueOffers.hits.length > 0) || (gtlPlaylists && gtlPlaylists.length > 0)

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
      <VenueBody
        venue={venue}
        onScroll={onScroll}
        playlists={gtlPlaylists}
        venueOffers={venueOffers}
        shouldDisplayCTA={shouldDisplayCTA}
      />
      {/* On native VenueHeader is called after Body to implement the BlurView for iOS */}
      {isWeb ? null : (
        <VenueHeader
          headerTransition={headerTransition}
          title={venue.publicName || venue.name}
          venue={venue}
        />
      )}
      {shouldDisplayCTA ? <VenueCTA venue={venue} /> : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
