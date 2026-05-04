import { useIsFocused } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { AB_TESTS } from 'shared/useABSegment/abTests'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { CustomListRenderItem, Playlist } from 'ui/components/Playlist'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { LENGTH_S, RATIO_HOME_IMAGE } from 'ui/theme'

type VenueMapOfferPlaylistProps = {
  offers: Offer[]
  playlistType: PlaylistType
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
  onPressMore?: () => void
}

const PLAYLIST_ITEM_HEIGHT = LENGTH_S
const PLAYLIST_ITEM_WIDTH = PLAYLIST_ITEM_HEIGHT * RATIO_HOME_IMAGE

const keyExtractor = (item: Offer) => item.objectID

export const VenueMapOfferPlaylist = ({
  offers,
  onPressMore,
  playlistType,
  onViewableItemsChanged,
}: VenueMapOfferPlaylistProps) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const isFocused = useIsFocused()
  const proAdvicesSegment = useABSegment(AB_TESTS.PRO_REVIEWS_ON_OFFER)
  const enableProAdvicesTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_PLAYLIST)

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item }) => {
      const tag = renderInteractionTag({
        theme,
        likesCount: item.offer.likes,
        clubAdvicesCount: item.offer.chroniclesCount,
        hasSmallLayout: true,
        isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
        subcategoryId: item.offer.subcategoryId,
        proAdvicesCount:
          enableProAdvicesTag && proAdvicesSegment === 'A' ? item.offer.proAdvicesCount : undefined,
      })
      return (
        <OfferTile
          offerId={Number(item.objectID)}
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          name={item.offer.name}
          offerLocation={item._geoloc}
          analyticsFrom="venueMap"
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayedPrice(item.offer.prices, currency, euroToPacificFrancRate)}
          width={PLAYLIST_ITEM_WIDTH}
          height={PLAYLIST_ITEM_HEIGHT}
          playlistType={playlistType}
          interactionTag={tag}
        />
      )
    },
    [
      currency,
      enableProAdvicesTag,
      euroToPacificFrancRate,
      labelMapping,
      mapping,
      playlistType,
      proAdvicesSegment,
      theme,
    ]
  )

  const handleOfferPlaylistViewableItemsChanged = useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      if (!isFocused) return
      onViewableItemsChanged(items, 'venue_map', 'offer', 0)
    },
    [isFocused, onViewableItemsChanged]
  )

  return (
    <React.Fragment>
      <ObservedPlaylist onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <Playlist
            data={offers}
            itemHeight={PLAYLIST_ITEM_HEIGHT}
            itemWidth={PLAYLIST_ITEM_WIDTH}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            FlatListComponent={FlatList}
            testID="venueOfferPlaylist"
            itemSeparatorSize={theme.designSystem.size.spacing.s}
            horizontalMargin={theme.designSystem.size.spacing.l}
            ref={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
          />
        )}
      </ObservedPlaylist>
      <StyledView>
        <StyledButton
          wording="Voir les offres du lieu"
          onPress={onPressMore}
          icon={PlainArrowNext}
          variant="tertiary"
          color="neutral"
        />
      </StyledView>
    </React.Fragment>
  )
}

const StyledView = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledButton = styled(Button)({
  transform: 'translateY(-10px)',
})
