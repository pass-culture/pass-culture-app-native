import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  artistName: string
  items: AlgoliaOfferWithArtistAndEan[]
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

export const ArtistTopOffers: FunctionComponent<Props> = ({ artistName, items }) => {
  return items.length > 0 ? (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      ListHeaderComponent={<StyledTitle3>Ses oeuvres populaires</StyledTitle3>}
      ItemSeparatorComponent={StyledSeparator}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={false}
      renderItem={({ item }) => renderItem({ item, artistName })}
    />
  ) : null
}

const StyledTitle3 = styled(Typo.Title3)({
  marginBottom: getSpacing(4),
})

const contentContainerStyle = {
  marginHorizontal: theme.contentPage.marginHorizontal,
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  marginVertical: getSpacing(4),
}))
