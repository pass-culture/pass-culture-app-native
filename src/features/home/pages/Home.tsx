import { useRoute } from '@react-navigation/native'
import React, { useCallback, useState, FunctionComponent, memo } from 'react'
import {
  FlatList,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken,
} from 'react-native'
import styled from 'styled-components/native'

import { useHomepageModules } from 'features/home/api'
import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
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
import { isOfferModuleTypeguard, isVenuesModuleTypeguard } from 'features/home/typeguards'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useABTestingContext } from 'libs/ABTesting'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'
import { Spacer } from 'ui/theme'

interface OnViewableItemsChangedProps {
  viewableItems: ViewToken[]
  changed: ViewToken[]
}

const keyExtractor = (item: ProcessedModule, index: number) =>
  'moduleId' in item ? item.moduleId : `recommendation${index}`

const UnmemoizedListHeaderComponent = () => (
  <ListHeaderContainer>
    <Spacer.TopScreen />
    <HomeHeader />
  </ListHeaderContainer>
)

const ListHeaderComponent = memo(UnmemoizedListHeaderComponent)

const UnMemoizedModule = ({
  item,
  index,
  homeEntryId,
  visible,
}: {
  item: ProcessedModule
  index: number
  homeEntryId: string | undefined
  visible: boolean
}) => {
  if (isOfferModuleTypeguard(item))
    return (
      <OffersModule
        moduleId={item.moduleId}
        visible={visible}
        search={item.search}
        display={item.display}
        cover={item instanceof OffersWithCover ? item.cover : null}
        index={index}
        homeEntryId={homeEntryId}
      />
    )

  if (isVenuesModuleTypeguard(item))
    return (
      <VenuesModule
        moduleId={item.moduleId}
        visible={visible}
        display={item.display}
        search={item.search}
        homeEntryId={homeEntryId}
        index={index}
      />
    )

  if (item instanceof RecommendationPane)
    return (
      <RecommendationModule
        moduleId={item.moduleId}
        visible={visible}
        index={index}
        displayParameters={item.displayParameters}
        recommendationParameters={item.recommendationParameters}
        homeEntryId={homeEntryId}
      />
    )

  if (item instanceof ExclusivityPane)
    return (
      <ExclusivityModule
        moduleId={item.moduleId}
        visible={visible}
        title={item.title}
        alt={item.alt}
        image={item.image}
        id={item.id}
        display={item.display}
        homeEntryId={homeEntryId}
        index={index}
      />
    )

  if (item instanceof BusinessPane)
    return <BusinessModule {...item} visible={visible} homeEntryId={homeEntryId} index={index} />

  return <React.Fragment></React.Fragment>
}

const Module = memo(UnMemoizedModule)

const renderModule = (
  { item, index }: { item: ProcessedModule; index: number },
  homeEntryId: string | undefined,
  visible: boolean
) => <Module item={item} index={index} homeEntryId={homeEntryId} visible={visible} />

export const OnlineHome: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { homeEntryId: ABTestingEntryId } = useABTestingContext()
  const { modules, homeEntryId } = useHomepageModules(params?.entryId ?? ABTestingEntryId) || {}
  const logHasSeenAllModules = useFunctionOnce(() => analytics.logAllModulesSeen(modules.length))
  const [visibleIdx, setVisibleIdx] = useState<number[]>([0])
  const showSkeleton = useShowSkeleton()

  const onViewableItemsChanged = useCallback(({ viewableItems }: OnViewableItemsChangedProps) => {
    const visibleIndexes = viewableItems.map((item) => item.index || 0)

    setVisibleIdx((indexes) => [...new Set([...indexes, ...visibleIndexes])].sort((a, b) => a - b))
  }, [])

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) logHasSeenAllModules()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onScroll={onScroll}
          data={modules}
          renderItem={({ item, index }) =>
            renderModule({ item, index }, homeEntryId, visibleIdx.includes(index))
          }
          keyExtractor={keyExtractor}
          ListFooterComponent={<Spacer.TabBar />}
          ListHeaderComponent={ListHeaderComponent}
          initialNumToRender={5}
          onEndReachedThreshold={1}
          removeClippedSubviews={false}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 0,
            waitForInteraction: false,
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          bounces
        />
      </HomeBodyLoadingContainer>
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

export const Home: FunctionComponent = () => {
  const netInfo = useNetInfo()
  if (netInfo.isConnected) {
    return <OnlineHome />
  }
  return <OfflinePage />
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
