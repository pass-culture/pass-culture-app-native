import React from 'react'
import { View } from 'react-native'

import { useCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { ThematicSearchPlaylist } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylist'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { Spacer } from 'ui/theme'

export const CinemaPlaylist: React.FC = () => {
  const { offers: cinemaPlaylists, isLoading: arePlaylistsLoading } = useCinemaOffers()

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <View testID="playlistsThematicSearchCinema">
      {cinemaPlaylists?.map((playlist) => {
        if (playlist.offers.hits.length > 0) {
          return (
            <View key={playlist.title}>
              <ThematicSearchPlaylist
                playlist={playlist}
                analyticsFrom="thematicsearch"
                route="ThematicSearch"
              />
              <Spacer.Column numberOfSpaces={4} />
            </View>
          )
        }
        return null
      })}
      <Spacer.Column numberOfSpaces={6} />
    </View>
  )
}
