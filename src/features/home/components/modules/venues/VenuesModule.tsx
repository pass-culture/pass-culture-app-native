import React, { useCallback, useEffect } from 'react'
import { ViewToken } from 'react-native'
import { styled } from 'styled-components/native'

import { VenueTile } from 'features/home/components/modules/venues/VenueTile'
import { ObservedPlaylist } from 'features/home/components/parsers/ObservedPlaylist'
import { ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
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
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
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
  onViewableItemsChanged,
}: VenuesModuleProps) => {
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
      />
    ),
    [moduleName, moduleId, homeEntryId]
  )

  const shouldModuleBeDisplayed = playlistItems.length > displayParameters.minOffers

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.VENUES_PLAYLIST,
        index,
        homeEntryId,
        venues: (playlistItems as VenueHit[]).map((item) => String(item.id)),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  return (
    <ObservedPlaylist onViewableItemsChanged={onViewableItemsChanged}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PlaylistContainer>
          <PassPlaylist
            testID="venuesModuleList"
            title={displayParameters.title}
            subtitle={displayParameters.subtitle}
            data={playlistItems || []}
            itemHeight={ITEM_HEIGHT}
            itemWidth={ITEM_WIDTH}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            tileType="venue"
            withMargin={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            playlistRef={listRef}
          />
        </PlaylistContainer>
      )}
    </ObservedPlaylist>
  )
}

const PlaylistContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
