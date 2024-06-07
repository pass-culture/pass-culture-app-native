import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Trend } from 'features/home/components/Trend'
import { TrendBlock } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing } from 'ui/theme'

type Trends = {
  moduleId: string
  items: TrendBlock[]
}

export const TrendsModule = ({ items }: Trends) => {
  const enableTrendsModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CIRCLE_NAV_BUTTONS)
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 375

  if (!enableTrendsModule) return null

  return (
    <Container isSmallScreen={isSmallScreen}>
      {items.map((props) => (
        <Trend key={props.title} {...props} />
      ))}
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
