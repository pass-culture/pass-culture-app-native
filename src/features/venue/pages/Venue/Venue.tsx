import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { useVenueOffersArtists } from 'features/venue/api/useVenueOffersArtists/useVenueOffersArtists'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { VIDEO_SEEN_STORAGE_KEY } from 'features/venue/constants'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { gtlPlaylists } = useGTLPlaylists({ venue, queryKey: 'VENUE_GTL_PLAYLISTS' })
  const { data: venueOffers } = useVenueOffers(venue)
  const { data: venueArtists } = useVenueOffersArtists(venue)
  const isVideoFeatureFlagActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE)

  const [videoAlreadySeen, setVideoAlreadySeen] = useState<boolean>()

  const handleVideoFakeDoorClose = () => {
    setVideoAlreadySeen(true)
    storage.saveString(VIDEO_SEEN_STORAGE_KEY, 'true')
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

  if (!venue) return null

  return videoAlreadySeen === undefined ? null : (
    <OfferCTAProvider>
      <VenueContent
        venue={venue}
        gtlPlaylists={gtlPlaylists}
        venueArtists={venueArtists}
        venueOffers={venueOffers}
        videoSectionVisible={isVideoFeatureFlagActive && !videoAlreadySeen}
        onCloseVideoFakeDoor={handleVideoFakeDoorClose}
      />
    </OfferCTAProvider>
  )
}
