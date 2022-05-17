import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState, FunctionComponent } from 'react'
import {
  FlatList,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native'
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
import { useABTestingContext } from 'libs/ABTesting'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Spinner } from 'ui/components/Spinner'
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
    return (
      <RecommendationModule
        index={index}
        displayParameters={item.displayParameters}
        recommendationParameters={item.recommendationParameters}
      />
    )

  if (item instanceof ExclusivityPane)
    return (
      <ExclusivityModule alt={item.alt} image={item.image} id={item.id} display={item.display} />
    )

  if (item instanceof BusinessPane) return <BusinessModule module={item} />

  return <React.Fragment></React.Fragment>
}

const FooterComponent = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <React.Fragment>
      {!!isLoading && (
        <React.Fragment>
          <Spinner />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      <Spacer.TabBar />
    </React.Fragment>
  )
}

export const Home: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { homeEntryId } = useABTestingContext()
  const modules = useHomepageModules(params?.entryId ?? homeEntryId) || []
  const logHasSeenAllModules = useFunctionOnce(() => analytics.logAllModulesSeen(modules.length))
  const showSkeleton = useShowSkeleton()
  const initialNumToRender = 5
  const maxToRenderPerBatch = 5
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const modulesToDisplay = Platform.OS === 'web' ? modules : modules.slice(0, maxIndex)

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent) && modulesToDisplay.length === modules.length)
        logHasSeenAllModules()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modules.length, modulesToDisplay.length]
  )

  const onEndReached = useCallback(() => {
    if (Platform.OS === 'web') return
    if (maxIndex < modules.length) {
      setIsLoading(true)
      setMaxIndex(maxIndex + maxToRenderPerBatch)
    }
  }, [modules.length, maxIndex])

  useEffect(() => {
    // We use this to load more modules, in case the content size doesn't change after the load triggered by onEndReached (i.e. no new modules were shown).
    const loadMore = setInterval(() => {
      if (maxIndex < modules.length && isLoading) {
        setMaxIndex(maxIndex + maxToRenderPerBatch)
      } else {
        setIsLoading(false)
      }
    }, 3000)

    return () => clearInterval(loadMore)
  }, [modules.length, isLoading, maxIndex])

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
          data={modulesToDisplay}
          renderItem={renderModule}
          keyExtractor={keyExtractor}
          ListFooterComponent={<FooterComponent isLoading={isLoading} />}
          ListHeaderComponent={ListHeaderComponent}
          initialNumToRender={initialNumToRender}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={false}
          onEndReached={onEndReached}
          onContentSizeChange={() => setIsLoading(false)}
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
