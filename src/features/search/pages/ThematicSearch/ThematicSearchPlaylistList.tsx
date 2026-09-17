import { useIsFocused } from '@react-navigation/native'
import React from 'react'

import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export type ThematicSearchPlaylistListProps = {
  playlists: ThematicSearchPlaylistData[]
  isLoading: boolean
  shouldDisplayVenuesPlaylist?: boolean
  searchId?: string
}

export const ThematicSearchPlaylistList: React.FC<ThematicSearchPlaylistListProps> = ({
  playlists,
  isLoading: arePlaylistsLoading,
  shouldDisplayVenuesPlaylist,
  searchId,
}) => {
  const isFocused = useIsFocused()

  if (arePlaylistsLoading) {
    return <ThematicSearchSkeleton />
  }

  return (
    <ViewGap gap={6}>
      {playlists?.map((playlist, index) => {
        if (playlist.offers.hits.length > 0) {
          // Calculate playlist if venues playlist is displayed
          const playlistIndex = (shouldDisplayVenuesPlaylist ? 1 : 0) + index
          return (
            <ObservedPlaylist
              key={playlist.title}
              onItemViewed={({ index: itemIndex, item }) => {
                if (!isFocused || !searchId) return
                void logViewItem({
                  origin: 'search',
                  playlistIndex,
                  index: itemIndex,
                  type: 'offer',
                  id: item.objectID,
                  moduleId: playlist.title,
                  searchId,
                })
              }}>
              {({ listRef, handleViewableItemsChanged }) => (
                <ThematicSearchPlaylist
                  playlist={playlist}
                  analyticsFrom="thematicsearch"
                  route="ThematicSearch"
                  playlistRef={listRef}
                  onViewableItemsChanged={handleViewableItemsChanged}
                  searchId={searchId}
                />
              )}
            </ObservedPlaylist>
          )
        }
        return null
      })}
    </ViewGap>
  )
}
