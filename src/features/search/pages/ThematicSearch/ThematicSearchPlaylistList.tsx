import React from 'react'

import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

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
    <ViewGap gap={6}>
      {playlists?.map((playlist) => {
        if (playlist.offers.hits.length > 0) {
          return (
            <ThematicSearchPlaylist
              playlist={playlist}
              analyticsFrom="thematicsearch"
              route="ThematicSearch"
              key={playlist.title}
            />
          )
        }
        return null
      })}
    </ViewGap>
  )
}
