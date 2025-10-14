import { useIsFocused } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ViewToken } from 'react-native'

import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export type ThematicSearchPlaylistListProps = {
  playlists: ThematicSearchPlaylistData[]
  isLoading: boolean
  shouldDisplayVenuesPlaylist?: boolean
  onViewableItemsChanged?: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
}

export const ThematicSearchPlaylistList: React.FC<ThematicSearchPlaylistListProps> = ({
  playlists,
  isLoading: arePlaylistsLoading,
  shouldDisplayVenuesPlaylist,
  onViewableItemsChanged,
}) => {
  const isFocused = useIsFocused()

  const handleThematicSearchPlaylistViewableItemsChanged = useCallback(
    (playlistTitle: string, playlistIndex: number) =>
      (items: Pick<ViewToken, 'key' | 'index'>[]) => {
        if (!isFocused) return
        onViewableItemsChanged?.(items, playlistTitle, 'offer', playlistIndex)
      },
    [isFocused, onViewableItemsChanged]
  )

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
              onViewableItemsChanged={handleThematicSearchPlaylistViewableItemsChanged(
                playlist.title,
                playlistIndex
              )}>
              {({ listRef, handleViewableItemsChanged }) => (
                <ThematicSearchPlaylist
                  playlist={playlist}
                  analyticsFrom="thematicsearch"
                  route="ThematicSearch"
                  playlistRef={listRef}
                  onViewableItemsChanged={handleViewableItemsChanged}
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
