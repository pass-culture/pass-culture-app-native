import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { useLocation } from 'libs/location'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Typo, getSpacing } from 'ui/theme'

import { useArtistQuery } from '../../queries/useArtistQuery'
import { useArtistTopOffersPlaylistQuery } from '../../queries/useOffersByArtistQuery'

type Props = {
  artistId: string
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

const renderItem = ({
  item,
  artistName,
}: {
  item: AlgoliaOfferWithArtistAndEan
  artistName: string
}) => {
  const subtitles = item.offer.bookFormat ? [item.offer.bookFormat] : undefined
  return (
    <HorizontalOfferTile
      offer={item}
      analyticsParams={{
        from: 'artist',
        artistName,
      }}
      subtitles={subtitles}
    />
  )
}

export const ArtistTopOffersContainer: FunctionComponent<Props> = ({ artistId }) => {
  const { userLocation } = useLocation()
  const transformHits = useTransformOfferHits()
  const { data: artist } = useArtistQuery(artistId)
  const { data: artistTopOffers, status } = useArtistTopOffersPlaylistQuery({
    artistId,
    userLocation,
    transformHits,
  })

  switch (status) {
    case 'idle':
    case 'loading':
      return <OfferPlaylistSkeleton size={TileSize.LARGE} numberOfTiles={4} />

    case 'success': {
      return artist && artistTopOffers && artistTopOffers.length > 0 ? (
        <FlatList
          data={artistTopOffers}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<StyledTitle3>Ses oeuvres populaires</StyledTitle3>}
          ItemSeparatorComponent={StyledSeparator}
          contentContainerStyle={contentContainerStyle}
          scrollEnabled={false}
          renderItem={({ item }) => renderItem({ item, artistName: artist.name })}
        />
      ) : null
    }

    case 'error':
      return null
  }
}

const StyledTitle3 = styled(Typo.Title3)({
  marginBottom: getSpacing(4),
})

const contentContainerStyle = {
  marginHorizontal: theme.contentPage.marginHorizontal,
}

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
