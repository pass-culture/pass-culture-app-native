import React, { useCallback, useEffect } from 'react'
import { ViewToken } from 'react-native'
import { useTheme } from 'styled-components'
import { styled } from 'styled-components/native'

import { VenueTile } from 'features/home/components/modules/venues/VenueTile'
import { HomepageModuleType, ModuleData, VenuesModuleParameters } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { LENGTH_S } from 'ui/theme'

type VenuesModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  venuesParameters: VenuesModuleParameters
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
  venuesParameters,
  index,
  homeEntryId,
  data,
  onViewableItemsChanged,
}: VenuesModuleProps) => {
  const moduleName = displayParameters.title
  const { playlistItems = [] } = data ?? { playlistItems: [] }
  const { designSystem } = useTheme()
  const isExclusiveVolunteering = displayParameters.isExclusiveVolunteering ?? false
  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile
        moduleName={moduleName}
        moduleId={moduleId}
        homeEntryId={homeEntryId}
        venue={item}
        width={width}
        height={height}
        originDetails={isExclusiveVolunteering ? 'volunteeringPlaylist' : undefined}
      />
    ),
    [moduleName, moduleId, homeEntryId, isExclusiveVolunteering]
  )

  const shouldModuleBeDisplayed = playlistItems.length > displayParameters.minOffers

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
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

  const onBeforeNavigate = () =>
    void analytics.logClickSeeAll({ type: 'venues', moduleName, moduleId, from: 'home' })

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistVenues' as const,
    params: {
      type: VerticalPlaylist.ModuleVenues,
      module: {
        id: moduleId,
        type: HomepageModuleType.VenuesModule,
        title: moduleName,
        displayParameters,
        venuesParameters,
      },
    },
  }

  return (
    <Container gap={4}>
      <ObservedPlaylist onViewableItemsChanged={onViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <PassPlaylist
            title={displayParameters.title}
            subtitle={displayParameters.subtitle}
            data={playlistItems || []}
            itemHeight={ITEM_HEIGHT}
            itemWidth={ITEM_WIDTH}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            tileType="venue"
            withMargin
            contentContainerStyle={{ paddingHorizontal: designSystem.size.spacing.xl }}
            onViewableItemsChanged={handleViewableItemsChanged}
            playlistRef={listRef}
            noMarginBottom
            seeAllButton={{ onBeforeNavigate, navigateToVerticalPlaylist }}
          />
        )}
      </ObservedPlaylist>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))
