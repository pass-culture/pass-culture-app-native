import { slice } from 'lodash'
import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

import { VideoMultiOfferTile } from 'features/home/components/modules/video/VideoMultiOfferTile'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { Offer } from 'shared/offer/types'
import { CustomListRenderItem, Playlist } from 'ui/components/Playlist'

type Props = {
  offers: Offer[]
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
}

export const VideoMultiOfferPlaylist: FunctionComponent<Props> = ({
  offers,
  hideModal,
  analyticsParams,
}) => {
  const { tiles } = useTheme()
  const PLAYLIST_ITEM_HEIGHT = tiles.sizes.large.height + tiles.maxCaptionHeight.videoModuleOffer
  const PLAYLIST_ITEM_WIDTH = tiles.sizes.large.width

  const keyExtractor = (item: Offer) => item.objectID

  const renderItem: CustomListRenderItem<Offer> = ({ item }) => {
    return (
      <VideoMultiOfferTile offer={item} hideModal={hideModal} analyticsParams={analyticsParams} />
    )
  }

  const offersToDisplay = slice(offers, 0, 10)

  return (
    <Playlist
      testID="video-multi-offers-module-list"
      data={offersToDisplay}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      renderItem={renderItem}
      renderHeader={undefined}
      renderFooter={undefined}
      keyExtractor={keyExtractor}
      tileType="video-module-offer"
    />
  )
}
