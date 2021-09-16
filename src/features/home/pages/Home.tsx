import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { HomeBodyPlaceholder, HomeHeader } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useInitialScreenConfig } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { Spacer } from 'ui/theme'

import { useShowSkeleton } from './useShowSkeleton'

export const Home: FunctionComponent = function () {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const showSkeleton = useShowSkeleton()
  const { displayedModules, homeModules, recommendedHits } = useDisplayedHomeModules(
    params?.entryId
  )

  useInitialScreenConfig()
  useListenDeepLinksEffect()

  if (showSkeleton) {
    return (
      <ScrollView testID="homeScrollView" scrollEventThrottle={400} bounces={false}>
        <Spacer.TopScreen />
        <HomeHeader />
        <HomeBodyPlaceholder />
        <Spacer.TabBar />
      </ScrollView>
    )
  }

  return (
    <HomeBody
      displayedModules={displayedModules}
      homeModules={homeModules}
      recommendedHits={recommendedHits}
    />
  )
}
