import React, { Fragment, useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Playlist } from 'ui/components/Playlist'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, LENGTH_S, RATIO_HOME_IMAGE } from 'ui/theme'

type VenueOfferPlaylistProps = {
  offers: Offer[]
  onPressMore?: () => void
}

const PLAYLIST_ITEM_HEIGHT = LENGTH_S
const PLAYLIST_ITEM_WIDTH = PLAYLIST_ITEM_HEIGHT * RATIO_HOME_IMAGE

const keyExtractor = (item: Offer) => item.objectID

export const VenueOfferPlaylist = ({ offers, onPressMore }: VenueOfferPlaylistProps) => {
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem = useCallback(
    ({ item }: { item: Offer }) => (
      <OfferTile
        offerId={Number(item.objectID)}
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={mapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        name={item.offer.name}
        offerLocation={item._geoloc}
        analyticsFrom="venuemap"
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices)}
        width={PLAYLIST_ITEM_WIDTH}
        height={PLAYLIST_ITEM_HEIGHT}
        variant="new"
        isDuo={false}
      />
    ),
    [labelMapping, mapping]
  )

  return (
    <Fragment>
      <Playlist
        data={offers}
        itemHeight={PLAYLIST_ITEM_HEIGHT}
        itemWidth={PLAYLIST_ITEM_WIDTH}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        FlatListComponent={FlatList}
      />
      <StyleButtonTertiaryBlack
        inline
        wording="Voir les offres du lieu"
        onPress={onPressMore}
        icon={PlainArrowNext}
      />
    </Fragment>
  )
}

const StyleButtonTertiaryBlack = styled(ButtonTertiaryBlack)({
  transform: 'translateY(-10px)',
  paddingBottom: getSpacing(2),
})
