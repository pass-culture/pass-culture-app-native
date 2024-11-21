import React from 'react'
import { View } from 'react-native'

import { ThematicSearchPlaylist } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchPlaylistData } from 'features/search/pages/Search/ThematicSearch/types'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { Spacer } from 'ui/theme'

type ThematicSearchPlaylistListProps = {
  playlists: ThematicSearchPlaylistData[]
  testId: string
  arePlaylistsLoading: boolean
}

export const ThematicSearchPlaylistList: React.FC<ThematicSearchPlaylistListProps> = ({
  playlists,
  testId,
  arePlaylistsLoading,
}) => {
  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <View testID={testId}>
      {playlists?.map((playlist) => {
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
