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
  items: HitOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer | HitOfferWithArtistAndEan) => item.objectID

export const ArtistTopOffers: FunctionComponent<Props> = ({ items }) => {
  const renderItem = ({ item }: { item: HitOfferWithArtistAndEan }) => (
    <HorizontalOfferTile
      offer={item}
      analyticsParams={{
        from: 'artist',
      }}
    />
  )

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
      renderItem={renderItem}
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
