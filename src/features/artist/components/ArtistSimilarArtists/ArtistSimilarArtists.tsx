import { useIsFocused } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { useSimilarArtistsQuery } from 'features/artist/queries/useSimilarArtistsQuery'
import { asArtistId } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { HorizontalArtistsPlaylist } from 'ui/components/HorizontalArtistsPlaylist'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

type Props = {
  artistId: string
  index: number
}

const TITLE = 'Tu peux aussi aimer'

export const ArtistSimilarArtists: FunctionComponent<Props> = ({ artistId, index }) => {
  const isFocused = useIsFocused()
  const isSimilarArtistsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_SIMILAR_ARTISTS)
  const { data: artists = [], isLoading } = useSimilarArtistsQuery(artistId, {
    enabled: isSimilarArtistsEnabled,
  })

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: TITLE, from: 'artist' })
  }

  const handleItemPress = (id: string, name: string) => {
    void analytics.logConsultArtist({
      artistId: id,
      artistName: name,
      from: 'artist',
      originDetails: 'similarArtistsPlaylist',
    })
  }

  if (!isSimilarArtistsEnabled) return null
  if (artists.length === 0) return null

  return (
    <ObservedPlaylist
      onItemViewed={({ index: itemIndex, item }) => {
        if (!isFocused) return
        void analytics.logViewItem({
          origin: 'artist',
          playlistIndex: index,
          index: itemIndex,
          type: 'artist',
          id: asArtistId(item.id),
          playlistId: 'artistSimilarArtists',
          originId: asArtistId(artistId),
        })
      }}>
      {({ listRef, handleViewableItemsChanged }) => (
        <HorizontalArtistsPlaylist
          artists={artists}
          onItemPress={handleItemPress}
          title={TITLE}
          isLoading={isLoading}
          seeAllData={{
            onBeforeNavigate,
            navigateToVerticalPlaylist: {
              screen: 'VerticalPlaylistArtists',
              params: {
                title: TITLE,
                subtitle: undefined,
                similarToArtistId: artistId,
                originDetails: 'similarArtistsPlaylist',
              },
            },
            hideSearchSeeAll: true,
          }}
          itemConfig={{ size: AVATAR_MEDIUM, rounded: true }}
          listRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      )}
    </ObservedPlaylist>
  )
}
