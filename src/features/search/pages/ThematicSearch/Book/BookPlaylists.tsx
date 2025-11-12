import { useIsFocused } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ViewToken } from 'react-native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ThematicPlaylistProps } from 'features/search/types'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const BookPlaylists: React.FC<ThematicPlaylistProps> = ({
  shouldDisplayVenuesPlaylist,
  onViewableItemsChanged,
  searchId,
}) => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )

  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const searchGroupLabel = searchGroupLabelMapping[
    SearchGroupNameEnumv2.LIVRES
  ] as ContentfulLabelCategories

  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const transformHits = useTransformOfferHits()
  const isFocused = useIsFocused()

  const { data: bookGtlPlaylists, isLoading: areGtlPlaylistsLoading } = useGTLPlaylistsQuery({
    searchIndex: isReplicaAlgoliaIndexActive
      ? env.ALGOLIA_OFFERS_INDEX_NAME_B
      : env.ALGOLIA_OFFERS_INDEX_NAME,
    searchGroupLabel,
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    adaptPlaylistParameters,
    queryKey: 'THEMATIC_SEARCH_BOOKS_GTL_PLAYLISTS',
    transformHits,
  })

  const handleGtlViewableItemsChanged = useCallback(
    (playlistTitle: string, playlistIndex: number) =>
      (items: Pick<ViewToken, 'key' | 'index'>[]) => {
        if (!isFocused) return
        onViewableItemsChanged(items, playlistTitle, 'offer', playlistIndex)
      },
    [isFocused, onViewableItemsChanged]
  )

  return areGtlPlaylistsLoading ? (
    <ThematicSearchSkeleton />
  ) : (
    <ViewGap gap={6}>
      {bookGtlPlaylists?.map((playlist, index) => {
        // Calculate playlist if venues playlist is displayed
        const playlistIndex = shouldDisplayVenuesPlaylist ? index + 1 : index

        return (
          <ObservedPlaylist
            key={playlist.entryId}
            onViewableItemsChanged={handleGtlViewableItemsChanged(playlist.title, playlistIndex)}>
            {({ listRef, handleViewableItemsChanged }) => (
              <GtlPlaylist
                playlist={playlist}
                analyticsFrom="thematicsearch"
                route="ThematicSearch"
                noMarginBottom
                playlistRef={listRef}
                onViewableItemsChanged={handleViewableItemsChanged}
                searchId={searchId}
              />
            )}
          </ObservedPlaylist>
        )
      })}
    </ViewGap>
  )
}
