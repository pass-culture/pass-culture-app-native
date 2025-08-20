import React, { useEffect } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Trend } from 'features/home/components/Trend'
import { TrendBlock, TrendNavigationProps } from 'features/home/types'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

type Trends = {
  index: number
  moduleId: string
  homeEntryId: string
  items: TrendBlock[]
}

const isWeb = Platform.OS === 'web'

export const TrendsModule = ({ index, moduleId, homeEntryId, items }: Trends) => {
  const { width } = useWindowDimensions()
  const { selectedLocationMode } = useShouldDisplayVenueMap()
  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  const isSmallScreen = width < 375
  const shouldOpenMapDirectly = selectedLocationMode !== LocationMode.EVERYWHERE && !isWeb

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId,
      moduleType: ContentTypes.TRENDS,
      index,
      homeEntryId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogTrendsBlockClicked = (props: TrendBlock) =>
    analytics.logTrendsBlockClicked({
      moduleListID: moduleId,
      entryId: homeEntryId,
      moduleId: props.id,
      toEntryId: props.homeEntryId ?? '',
    })

  const getNavigationProps = (props: TrendBlock): TrendNavigationProps => {
    if (props.type === ContentTypes.VENUE_MAP_BLOCK && !isWeb) {
      return {
        navigateTo: { screen: 'VenueMap' },
        enableNavigate: shouldOpenMapDirectly,
        onBeforeNavigate: () => {
          removeSelectedVenue()
          handleLogTrendsBlockClicked(props)
          if (shouldOpenMapDirectly) {
            analytics.logConsultVenueMap({ from: 'trend_block' })
            return
          }
          showVenueMapLocationModal()
        },
      }
    }

    return {
      navigateTo: {
        screen: 'ThematicHome',
        params: { homeId: props.homeEntryId, moduleId: props.id, from: 'trend_block' },
      },
      onBeforeNavigate: () => {
        handleLogTrendsBlockClicked(props)
      },
    }
  }

  const renderTrends = (
    items: TrendBlock[],
    moduleId: string,
    getNavigationProps: (props: TrendBlock) => TrendNavigationProps
  ) =>
    items.map((props) => (
      <Trend key={props.title} moduleId={moduleId} {...props} {...getNavigationProps(props)} />
    ))

  return (
    <React.Fragment>
      {items.length <= 4 ? (
        <Container isSmallScreen={isSmallScreen} testID="static-trends-module">
          {renderTrends(items, moduleId, getNavigationProps)}
        </Container>
      ) : (
        <ScrollContainer
          horizontal
          isSmallScreen={isSmallScreen}
          contentContainerStyle={{ paddingLeft: getSpacing(4) }}
          testID="scrollable-trends-module">
          {renderTrends(items, moduleId, getNavigationProps)}
        </ScrollContainer>
      )}

      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
        openedFrom="trend_block"
      />
    </React.Fragment>
  )
}

const ScrollContainer = styled.ScrollView<{ isSmallScreen: boolean }>(
  ({ isSmallScreen, theme }) => {
    const mobileGap = isSmallScreen
      ? theme.designSystem.size.spacing.xs
      : theme.designSystem.size.spacing.s
    return {
      flexDirection: 'row',
      gap: theme.isDesktopViewport ? theme.designSystem.size.spacing.l : mobileGap,
      paddingBottom: theme.home.spaceBetweenModules,
    }
  }
)

const Container = styled.View<{ isSmallScreen: boolean }>(({ isSmallScreen, theme }) => {
  const mobileGap = isSmallScreen
    ? theme.designSystem.size.spacing.xs
    : theme.designSystem.size.spacing.s
  return {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.isDesktopViewport ? theme.designSystem.size.spacing.l : mobileGap,
    paddingBottom: theme.home.spaceBetweenModules,
  }
})
