import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Trend } from 'features/home/components/Trend'
import { TrendBlock } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing } from 'ui/theme'

type Trends = {
  index: number
  moduleId: string
  homeEntryId: string
  items: TrendBlock[]
}

export const TrendsModule = ({ index, moduleId, homeEntryId, items }: Trends) => {
  const enableTrendsModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CIRCLE_NAV_BUTTONS)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableTrendsModule,
    homeId: homeEntryId,
  })
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 375

  useEffect(() => {
    if (hasGraphicRedesign) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.TRENDS,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGraphicRedesign])

  if (!hasGraphicRedesign) return null

  return (
    <Container isSmallScreen={isSmallScreen}>
      {items.map((props) => {
        const logTrendsBlockClicked = () => {
          analytics.logTrendsBlockClicked({
            moduleListID: moduleId,
            entryId: homeEntryId,
            moduleId: props.id,
            toEntryId: props.homeEntryId ?? '',
          })
        }

        return (
          <Trend
            key={props.title}
            moduleId={moduleId}
            onBeforeNavigate={logTrendsBlockClicked}
            {...props}
          />
        )
      })}
    </Container>
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
