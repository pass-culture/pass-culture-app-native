import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
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

  const { userLocation, selectedLocationMode } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const transformHits = useTransformOfferHits()

  const { data: bookGtlPlaylists, isLoading: areGtlPlaylistsLoading } = useGTLPlaylistsQuery({
    searchIndex: isReplicaAlgoliaIndexActive
      ? env.ALGOLIA_OFFERS_INDEX_NAME_B
      : env.ALGOLIA_OFFERS_INDEX_NAME,
    searchGroupLabel,
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    adaptPlaylistParameters,
    transformHits,
  })

  return areGtlPlaylistsLoading ? (
    <ThematicSearchSkeleton />
  ) : (
    <ViewGap gap={6}>
      {bookGtlPlaylists?.map((playlist) => (
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
