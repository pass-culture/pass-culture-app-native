import React from 'react'
import { View } from 'react-native'

import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { Spacer } from 'ui/theme'

export type ThematicSearchPlaylistListProps = {
  playlists: ThematicSearchPlaylistData[]
  isLoading: boolean
}

export const ThematicSearchPlaylistList: React.FC<ThematicSearchPlaylistListProps> = ({
  playlists,
  isLoading: arePlaylistsLoading,
}) => {
  if (arePlaylistsLoading) {
    return <ThematicSearchSkeleton />
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
