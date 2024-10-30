import React from 'react'
import { View } from 'react-native'

import { useCinemaOffers } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/useCinemaOffers'
import { CinemaPlaylist } from 'features/search/pages/Search/SearchN1/category/Cinema/CinemaPlaylist'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { Spacer } from 'ui/theme'

export const Cinema: React.FC = () => {
  const { offers: cinemaPlaylists, isLoading: arePlaylistsLoading } = useCinemaOffers()

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <View>
      {cinemaPlaylists?.map((playlist) => {
        if (playlist.offers.hits.length > 0) {
          return (
            <View key={playlist.title}>
              <CinemaPlaylist playlist={playlist} analyticsFrom="searchn1" route="SearchN1" />
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
