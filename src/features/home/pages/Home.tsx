import React, { useState, FunctionComponent, useCallback } from 'react'
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { HomeBodyPlaceholder, HomeHeader } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { useInitialScreenConfig } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { Spacer } from 'ui/theme'

import { RecommendationPane } from '../contentful/moduleTypes'

import { useShowSkeleton } from './useShowSkeleton'

export const Home: FunctionComponent = function () {
  const showSkeleton = useShowSkeleton()
  const [recommendationY, setRecommendationY] = useState<number>(Infinity)
  const { displayedModules, algoliaModules, recommendedHits } = useDisplayedHomeModules()

  useInitialScreenConfig()
  useListenDeepLinksEffect()

  const logHasSeenAllModules = useFunctionOnce(() =>
    analytics.logAllModulesSeen(displayedModules.length)
  )

  const logHasSeenRecommendationModule = useFunctionOnce(() => {
    const recommendationModule = displayedModules.find((m) => m instanceof RecommendationPane)
    if (recommendationModule && recommendedHits.length > 0) {
      analytics.logRecommendationModuleSeen(
        (recommendationModule as RecommendationPane).display.title,
        recommendedHits.length
      )
    }
  })

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) logHasSeenAllModules()
      const padding = nativeEvent.contentSize.height - recommendationY
      if (isCloseToBottom({ ...nativeEvent, padding })) logHasSeenRecommendationModule()
    },
    [recommendationY, displayedModules.length]
  )

  return (
    <ScrollView
      testID="homeScrollView"
      scrollEventThrottle={400}
      bounces={false}
      onScroll={onScroll}>
      <Spacer.TopScreen />
      <HomeHeader />

      {showSkeleton ? <HomeBodyPlaceholder /> : null}
      <HomeBodyLoadingContainer isLoading={showSkeleton}>
        <HomeBody
          modules={displayedModules}
          algoliaModules={algoliaModules}
          recommendedHits={recommendedHits}
          setRecommendationY={setRecommendationY}
        />
      </HomeBodyLoadingContainer>
      <Spacer.TabBar />
    </ScrollView>
  )
}

const HomeBodyLoadingContainer = styled.View<{ isLoading: boolean }>(({ isLoading }) => ({
  height: isLoading ? 0 : undefined,
  overflow: 'hidden',
}))
