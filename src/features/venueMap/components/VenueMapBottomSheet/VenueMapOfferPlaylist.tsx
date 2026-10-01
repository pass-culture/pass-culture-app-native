import { useIsFocused } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import {
  getDisplayedClubAdviceType,
  renderInteractionTag,
} from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { CustomListRenderItem, Playlist } from 'ui/components/Playlist'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { LENGTH_S, RATIO_HOME_IMAGE } from 'ui/theme'

type VenueMapOfferPlaylistProps = {
  offers: Offer[]
  playlistType: PlaylistType
  venueId: number
  onPressMore?: () => void
}

const PLAYLIST_ITEM_HEIGHT = LENGTH_S
const PLAYLIST_ITEM_WIDTH = PLAYLIST_ITEM_HEIGHT * RATIO_HOME_IMAGE

const keyExtractor = (item: Offer) => item.objectID

export const VenueMapOfferPlaylist = ({
  offers,
  onPressMore,
  playlistType,
  venueId,
}: VenueMapOfferPlaylistProps) => {
  const theme = useTheme()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const isFocused = useIsFocused()
  const enableProAdvicesTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_PLAYLIST)
  const enableSceneClubTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SCENE_CLUB)

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item }) => {
      const interactionTagParams = {
        theme,
        likesCount: item.offer.likes,
        clubAdvicesCount: item.offer.chroniclesCount,
        hasSmallLayout: true,
        isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
        subcategoryId: item.offer.subcategoryId,
        proAdvicesCount: enableProAdvicesTag ? item.offer.proAdvicesCount : undefined,
        enableSceneClubTag,
      }
      const tag = renderInteractionTag(interactionTagParams)
      const clubAdviceType = getDisplayedClubAdviceType(interactionTagParams)
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
          clubAdviceType={clubAdviceType}
        />
      )
    },
    [
      currency,
      enableProAdvicesTag,
      enableSceneClubTag,
      euroToPacificFrancRate,
      labelMapping,
      mapping,
      playlistType,
      theme,
    ]
  )

  return (
    <React.Fragment>
      <ObservedPlaylist
        onItemViewed={({ index, item }) => {
          if (!isFocused) return
          void logViewItem({
            origin: 'venueMap',
            playlistIndex: 0,
            index,
            type: 'offer',
            id: item.objectID,
            playlistId: 'venue_map',
            originId: venueId.toString(),
          })
        }}>
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
