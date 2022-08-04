import React, { useCallback, useEffect } from 'react'

import { useVenueModule } from 'features/home/api/useVenueModule'
import { VenueTile } from 'features/home/atoms/VenueTile'
import { OfferModulePlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import {
  ContentTypes,
  DisplayParametersFields,
  VenuesSearchParametersFields,
} from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { VenueHit } from 'libs/search'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { LENGTH_M, LENGTH_S } from 'ui/theme'

type VenuesModuleProps = {
  moduleId: string
  visible: boolean
  display: DisplayParametersFields
  search: VenuesSearchParametersFields[]
  homeEntryId: string | undefined
  index: number
}

const ITEM_HEIGHT = LENGTH_S
const ITEM_WIDTH = ITEM_HEIGHT * (3 / 2)

const keyExtractor = (item: VenueHit) => item.id.toString()

export const VenuesModule = ({
  moduleId,
  display,
  search,
  index,
  visible,
  homeEntryId,
}: VenuesModuleProps) => {
  const { position } = useGeolocation()
  const moduleName = display.title
  const hits = useVenueModule({ search, moduleId }) || []

  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile
        moduleName={moduleName}
        moduleId={moduleId}
        venue={item}
        width={width}
        height={height}
        userPosition={position}
      />
    ),
    [position, moduleName, moduleId]
  )

  const shouldModuleBeDisplayed = hits.length > display.minOffers

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(
        moduleId,
        ContentTypes.VENUES_PLAYLIST,
        index,
        homeEntryId
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return <React.Fragment />
  if (!visible)
    return <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={5} title={display.title} />

  return (
    <PassPlaylist
      testID="offersModuleList"
      title={display.title}
      subtitle={display.subtitle}
      data={hits || []}
      itemHeight={ITEM_HEIGHT}
      itemWidth={ITEM_WIDTH}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}
