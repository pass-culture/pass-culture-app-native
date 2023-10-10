import React, { useCallback, useEffect } from 'react'

import { VenueTile } from 'features/home/components/modules/venues/VenueTile'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { LENGTH_S } from 'ui/theme'

type VenuesModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  homeEntryId: string | undefined
  index: number
  data?: ModuleData
}

const ITEM_HEIGHT = LENGTH_S
const ITEM_WIDTH = ITEM_HEIGHT * (3 / 2)

const keyExtractor = (item: VenueHit) => item.id.toString()

export const VenuesModule = ({
  moduleId,
  displayParameters,
  index,
  homeEntryId,
  data,
}: VenuesModuleProps) => {
  const { position } = useHomePosition()
  const moduleName = displayParameters.title
  const { playlistItems = [] } = data ?? { playlistItems: [] }

  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile
        moduleName={moduleName}
        moduleId={moduleId}
        homeEntryId={homeEntryId}
        venue={item}
        width={width}
        height={height}
        userPosition={position}
      />
    ),
    [position, moduleName, moduleId, homeEntryId]
  )

  const shouldModuleBeDisplayed = playlistItems.length > displayParameters.minOffers

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
  return (
    <PassPlaylist
      testID="offersModuleList"
      title={displayParameters.title}
      subtitle={displayParameters.subtitle}
      data={playlistItems || []}
      itemHeight={ITEM_HEIGHT}
      itemWidth={ITEM_WIDTH}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}
