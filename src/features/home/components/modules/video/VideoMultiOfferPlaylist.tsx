import React, { FunctionComponent } from 'react'

import { VideoMultiOfferTile } from 'features/home/components/modules/video/VideoMultiOfferTile'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { CustomListRenderItem, Playlist } from 'ui/components/Playlist'
import { getSpacing } from 'ui/theme'

const PLAYLIST_ITEM_HEIGHT = theme.tiles.sizes['large'].height + getSpacing(14)
const PLAYLIST_ITEM_WIDTH = theme.tiles.sizes['large'].width

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
  const keyExtractor = (item: Offer) => item.objectID

  const renderItem: CustomListRenderItem<Offer> = ({ item }) => {
    return (
      <VideoMultiOfferTile offer={item} hideModal={hideModal} analyticsParams={analyticsParams} />
    )
  }

  return (
    <Playlist
      testID="video-multi-offers-module-list"
      data={offers}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      renderItem={renderItem}
      renderHeader={undefined}
      renderFooter={undefined}
      keyExtractor={keyExtractor}
    />
  )
}
