import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { HomeBodyPlaceholder, HomeHeader } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { Spacer } from 'ui/theme'

import { useShowSkeleton } from './useShowSkeleton'

export const Home: FunctionComponent = function () {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const showSkeleton = useShowSkeleton()
  const {
    displayedModules,
    homeModules,
    homeVenuesModules,
    recommendedHits,
  } = useDisplayedHomeModules(params?.entryId)

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
      homeVenuesModules={homeVenuesModules}
      recommendedHits={recommendedHits}
    />
  )
}
