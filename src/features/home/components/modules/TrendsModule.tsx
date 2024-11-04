import React, { useEffect } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Trend } from 'features/home/components/Trend'
import { TrendBlock, TrendNavigationProps } from 'features/home/types'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useSelectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  const enableTrendsModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CIRCLE_NAV_BUTTONS)

  const { width } = useWindowDimensions()
  const { selectedLocationMode } = useShouldDisplayVenueMap()
  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()
  const { removeSelectedVenue } = useSelectedVenueActions()

  const isSmallScreen = width < 375
  const shouldOpenMapDirectly = selectedLocationMode !== LocationMode.EVERYWHERE && !isWeb

  useEffect(() => {
    if (enableTrendsModule) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.TRENDS,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTrendsModule])

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
        navigateTo: shouldOpenMapDirectly ? { screen: 'VenueMap' } : undefined,
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

  if (!enableTrendsModule) return null

  return (
    <React.Fragment>
      <Container isSmallScreen={isSmallScreen}>
        {items.map((props) => (
          <Trend key={props.title} moduleId={moduleId} {...props} {...getNavigationProps(props)} />
        ))}
      </Container>
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
        openedFrom="trend_block"
      />
    </React.Fragment>
  )
}

const Container = styled.View<{ isSmallScreen: boolean }>(({ isSmallScreen, theme }) => {
  const mobileGap = isSmallScreen ? getSpacing(1) : getSpacing(2)
  return {
    flexDirection: 'row',
    gap: theme.isDesktopViewport ? getSpacing(4) : mobileGap,
    justifyContent: 'center',
    paddingBottom: theme.home.spaceBetweenModules,
  }
})
