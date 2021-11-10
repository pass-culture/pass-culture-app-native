import React, { useCallback } from 'react'

import { ModuleTitle } from 'features/home/atoms'
import { VenueTile } from 'features/home/atoms/VenueTile'
import { DisplayParametersFields } from 'features/home/contentful'
import { GeoCoordinates } from 'libs/geolocation'
import { VenueHit } from 'libs/search'
import { Playlist, CustomListRenderItem } from 'ui/components/Playlist'
import { LENGTH_S, Spacer } from 'ui/theme'

type VenuesModuleProps = {
  hits: VenueHit[]
  display: DisplayParametersFields
  userPosition: GeoCoordinates | null
}

const ITEM_HEIGHT = LENGTH_S
const ITEM_WIDTH = ITEM_HEIGHT * (3 / 2)

const keyExtractor = (item: VenueHit) => item.id.toString()

export const VenuesModule = (props: VenuesModuleProps) => {
  const { hits, display, userPosition } = props

  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile venue={item} width={width} height={height} userPosition={userPosition} />
    ),
    []
  )

  return (
    <React.Fragment>
      <ModuleTitle title={display.title} />
      <Spacer.Column numberOfSpaces={4} />
      <Playlist
        testID="VenuesModuleList"
        data={hits}
        renderItem={renderItem}
        itemHeight={ITEM_HEIGHT}
        itemWidth={ITEM_WIDTH}
        keyExtractor={keyExtractor}
      />
    </React.Fragment>
  )
}
