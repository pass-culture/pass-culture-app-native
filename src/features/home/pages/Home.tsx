import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
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
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { RecommendationModule } from 'features/home/components/modules/RecommendationModule'
import { BusinessPane, ExclusivityPane, OffersWithCover } from 'features/home/contentful'
import { ProcessedModule, RecommendationPane } from 'features/home/contentful/moduleTypes'
import { isOfferModuleTypeguard, isVenuesModuleTypeguard } from 'features/home/typeguards'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { theme } from 'theme'
import { Spinner } from 'ui/components/Spinner'
import { getSpacing, Spacer } from 'ui/theme'

const keyExtractor = (item: ProcessedModule, index: number) =>
  'moduleId' in item ? item.moduleId : `recommendation${index}`

const ListHeaderComponent = () => (
  <ListHeaderContainer>
    <Spacer.TopScreen />
    <HomeHeader />
  </ListHeaderContainer>
)

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
}: {
  item: ProcessedModule
  index: number
  homeEntryId: string | undefined
}) => {
  if (isOfferModuleTypeguard(item))
    return (
      <OffersModule
        moduleId={item.moduleId}
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
    return <BusinessModule {...item} homeEntryId={homeEntryId} index={index} />

  return <React.Fragment></React.Fragment>
}

const Module = memo(UnmemoizedModule)

const renderModule = (
  { item, index }: { item: ProcessedModule; index: number },
  homeEntryId: string | undefined
) => <Module item={item} index={index} homeEntryId={homeEntryId} />

const FooterComponent = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <React.Fragment>
      {!!isLoading && (
        <FooterContainer>
          <Spinner />
        </FooterContainer>
      )}
      <Spacer.TabBar />
    </React.Fragment>
  )
}

export const OnlineHome: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, homeEntryId } = useHomepageModules(params?.entryId) || {}
  const logHasSeenAllModules = useFunctionOnce(() => analytics.logAllModulesSeen(modules.length))
  const trackEventHasSeenAllModules = useFunctionOnce(() =>
    BatchUser.trackEvent(BatchEvent.hasSeenAllTheHomepage)
  )
  const showSkeleton = useShowSkeleton()
  const initialNumToRender = 10
  const maxToRenderPerBatch = 5
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const modulesToDisplay = Platform.OS === 'web' ? modules : modules.slice(0, maxIndex)

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...nativeEvent, padding: theme.minScreenHeight * 2 })) {
        if (Platform.OS !== 'web' && maxIndex < modules.length) {
          setIsLoading(true)
          setMaxIndex(maxIndex + maxToRenderPerBatch)
        }
      }
      if (isCloseToBottom(nativeEvent) && modulesToDisplay.length === modules.length) {
        trackEventHasSeenAllModules()
        logHasSeenAllModules()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modules.length, modulesToDisplay.length]
  )

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
          scrollEventThrottle={1000}
          onScroll={onScroll}
          data={modulesToDisplay}
          renderItem={({ item, index }) => renderModule({ item, index }, homeEntryId)}
          keyExtractor={keyExtractor}
          ListFooterComponent={<FooterComponent isLoading={isLoading} />}
          ListHeaderComponent={ListHeaderComponent}
          initialNumToRender={initialNumToRender}
          removeClippedSubviews={false}
          onContentSizeChange={() => setTimeout(() => setIsLoading(false), 1000)}
          bounces
        />
      </HomeBodyLoadingContainer>
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

export const Home: FunctionComponent = () => {
  const netInfo = useNetInfoContext()
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

const FooterContainer = styled.View({
  paddingTop: getSpacing(2),
  paddingBottom: getSpacing(10),
})

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
