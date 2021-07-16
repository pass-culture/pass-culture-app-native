import { useRoute } from '@react-navigation/native'
import React, { useState, FunctionComponent, useCallback } from 'react'
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { HomeBodyPlaceholder, HomeHeader } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useInitialScreenConfig } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { Spacer } from 'ui/theme'

import { RecommendationPane } from '../contentful/moduleTypes'

import { useShowSkeleton } from './useShowSkeleton'

export const Home: FunctionComponent = function () {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const showSkeleton = useShowSkeleton()
  const [recommendationY, setRecommendationY] = useState<number>(Infinity)
  const { displayedModules, homeModules, recommendedHits } = useDisplayedHomeModules(
    params?.entryId
  )

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
  if (showSkeleton) {
    return (
      <ScrollView
        testID="homeScrollView"
        scrollEventThrottle={400}
        bounces={false}
        onScroll={onScroll}>
        <Spacer.TopScreen />
        <HomeHeader />
        <HomeBodyPlaceholder />
        <Spacer.TabBar />
      </ScrollView>
    )
  }

  return (
    <HomeBody
      modules={displayedModules}
      homeModules={homeModules}
      recommendedHits={recommendedHits}
      setRecommendationY={setRecommendationY}
      onScroll={onScroll}
    />
  )
}
