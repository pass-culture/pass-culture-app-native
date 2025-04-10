import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const BookPlaylists: React.FC = () => {
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )

  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const searchGroupLabel = searchGroupLabelMapping[
    SearchGroupNameEnumv2.LIVRES
  ] as ContentfulLabelCategories

  const { gtlPlaylists: bookGtlPlaylists, isLoading: areGtlPlaylistsLoading } = useGTLPlaylists({
    searchIndex: isReplicaAlgoliaIndexActive
      ? env.ALGOLIA_OFFERS_INDEX_NAME_B
      : env.ALGOLIA_OFFERS_INDEX_NAME,
    searchGroupLabel,
  })

  if (areGtlPlaylistsLoading) {
    return <ThematicSearchSkeleton />
  }

  return (
    <ViewGap gap={6}>
      {bookGtlPlaylists.map((playlist) => (
        <GtlPlaylist
          key={playlist.entryId}
          playlist={playlist}
          analyticsFrom="thematicsearch"
          route="ThematicSearch"
          noMarginBottom
        />
      ))}
    </ViewGap>
  )
}
