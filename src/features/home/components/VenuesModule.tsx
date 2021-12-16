import React, { useCallback } from 'react'

import { VenueTile } from 'features/home/atoms/VenueTile'
import { DisplayParametersFields, VenuesSearchParametersFields } from 'features/home/contentful'
import { useVenueModule } from 'features/home/pages/useVenueModule'
import { useGeolocation } from 'libs/geolocation'
import { VenueHit } from 'libs/search'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { LENGTH_S } from 'ui/theme'

type VenuesModuleProps = {
  moduleId: string
  display: DisplayParametersFields
  search: VenuesSearchParametersFields[]
}

const ITEM_HEIGHT = LENGTH_S
const ITEM_WIDTH = ITEM_HEIGHT * (3 / 2)

const keyExtractor = (item: VenueHit) => item.id.toString()

export const VenuesModule = ({ moduleId, display, search }: VenuesModuleProps) => {
  const { position } = useGeolocation()
  const hits = useVenueModule({ search, moduleId }) || []

  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile venue={item} width={width} height={height} userPosition={position} />
    ),
    [position]
  )

  const shouldModuleBeDisplayed = hits.length > display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <PassPlaylist
      testID="offersModuleList"
      title={display.title}
      data={hits || []}
      itemHeight={ITEM_HEIGHT}
      itemWidth={ITEM_WIDTH}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}
