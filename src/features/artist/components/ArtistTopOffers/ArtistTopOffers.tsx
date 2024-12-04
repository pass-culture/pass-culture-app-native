import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { HitOfferWithArtistAndEan } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

type Props = {
  artistName: string
  items: HitOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | HitOfferWithArtistAndEan) => item.objectID

const renderItem = ({
  item,
  artistName,
}: {
  item: HitOfferWithArtistAndEan
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
      ListHeaderComponent={
        <React.Fragment>
          <TypoDS.Title3>Ses offres populaires</TypoDS.Title3>
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      }
      ItemSeparatorComponent={StyledSeparator}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={false}
      renderItem={({ item }) => renderItem({ item, artistName })}
    />
  ) : null
}

const contentContainerStyle = {
  marginHorizontal: theme.contentPage.marginHorizontal,
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  marginVertical: getSpacing(4),
}))
