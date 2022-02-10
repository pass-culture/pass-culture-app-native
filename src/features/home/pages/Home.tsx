import { useRoute } from '@react-navigation/native'
import React, { useCallback, FunctionComponent } from 'react'
import { FlatList, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageModules } from 'features/home/api'
import {
  BusinessModule,
  ExclusivityModule,
  OffersModule,
  VenuesModule,
} from 'features/home/components'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { HomeHeader } from 'features/home/components/HomeHeader'
import { RecommendationModule } from 'features/home/components/RecommendationModule'
import { BusinessPane, ExclusivityPane, OffersWithCover } from 'features/home/contentful'
import { RecommendationPane, ProcessedModule } from 'features/home/contentful/moduleTypes'
import { useShowSkeleton } from 'features/home/pages/useShowSkeleton'
import { isOfferModuleTypeguard, isVenuesModuleTypeguard } from 'features/home/typeguards'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Spacer } from 'ui/theme'

const keyExtractor = (item: ProcessedModule, index: number) =>
  'moduleId' in item ? item.moduleId : `recommendation${index}`

const ListHeaderComponent = () => (
  <ListHeaderContainer>
    <Spacer.TopScreen />
    <HomeHeader />
  </ListHeaderContainer>
)

const renderModule = ({ item, index }: { item: ProcessedModule; index: number }) => {
  if (isOfferModuleTypeguard(item))
    return (
      <OffersModule
        moduleId={item.moduleId}
        search={item.search}
        display={item.display}
        cover={item instanceof OffersWithCover ? item.cover : null}
        index={index}
      />
    )

  if (isVenuesModuleTypeguard(item))
    return <VenuesModule moduleId={item.moduleId} display={item.display} search={item.search} />

  if (item instanceof RecommendationPane)
    return <RecommendationModule index={index} display={item.display} />

  if (item instanceof ExclusivityPane)
    return (
      <ExclusivityModule alt={item.alt} image={item.image} id={item.id} display={item.display} />
    )

  if (item instanceof BusinessPane) return <BusinessModule module={item} />

  return <React.Fragment></React.Fragment>
}

export const Home: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const modules = useHomepageModules(params?.entryId) || []
  const logHasSeenAllModules = useFunctionOnce(() => analytics.logAllModulesSeen(modules.length))
  const showSkeleton = useShowSkeleton()

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) logHasSeenAllModules()
    },
    [modules.length]
  )

  return (
    <Container>
      {showSkeleton ? (
        <ScrollView
          testID="homeScrollView"
          scrollEventThrottle={400}
          bounces={false}
          scrollEnabled={false}>
          <Spacer.TopScreen />
          <HomeHeader />
          <HomeBodyPlaceholder />
          <Spacer.TabBar />
        </ScrollView>
      ) : (
        <React.Fragment />
      )}
      <HomeBodyLoadingContainer hide={showSkeleton}>
        <FlatList
          testID="homeBodyScrollView"
          scrollEventThrottle={400}
          bounces={false}
          onScroll={onScroll}
          data={modules}
          renderItem={renderModule}
          keyExtractor={keyExtractor}
          ListFooterComponent={<Spacer.TabBar />}
          ListHeaderComponent={ListHeaderComponent}
          // initialNumToRender is used for performance reasons
          // However, we have to disable it if we don't want the skeleton to infinitely load.
          // Indeed if the modules are hidden, they will still be fetching and thus showSkeleton
          // will be true.
          initialNumToRender={modules.length}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={false}
        />
      </HomeBodyLoadingContainer>
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

const HomeBodyLoadingContainer = styled.View<{ hide: boolean }>(({ hide }) => ({
  height: hide ? 0 : '100%',
  overflow: 'hidden',
}))

const Container = styled.View({
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
})

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
