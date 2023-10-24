import { useScrollToTop } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useGetOffersData } from 'features/home/api/useGetOffersData'
import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { useOnScroll } from 'features/home/pages/helpers/useOnScroll'
import { HomepageModule, isOffersModule, isVenuesModule } from 'features/home/types'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { usePerformanceCalculation } from 'shared/performance/usePerformanceCalculation/usePerformanceCalculation'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spinner } from 'ui/components/Spinner'
import { getSpacing, Spacer } from 'ui/theme'

type GenericHomeProps = {
  Header: React.JSX.Element
  modules: HomepageModule[]
  homeId: string
  shouldDisplayScrollToTop?: boolean
  onScroll?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
  videoModuleId?: string
  statusBar?: React.JSX.Element
}
const keyExtractor = (item: HomepageModule) => item.id

const renderModule = (
  { item, index }: { item: HomepageModule; index: number },
  homeId: string,
  videoModuleId?: string
) => (
  <HomeModule
    item={item}
    index={index}
    homeEntryId={homeId}
    data={isOffersModule(item) || isVenuesModule(item) ? item.data : undefined}
    videoModuleId={videoModuleId}
  />
)

const FooterComponent = ({ hasShownAll }: { hasShownAll: boolean }) => {
  return (
    <React.Fragment>
      {/* As long as all modules are not shown, we keep the spinner */}
      {!hasShownAll && (
        <FooterContainer>
          <Spinner testID="spinner" />
        </FooterContainer>
      )}
      <Spacer.TabBar />
    </React.Fragment>
  )
}

const MODULES_TIMEOUT_VALUE_IN_MS = 3000

const OnlineHome: FunctionComponent<GenericHomeProps> = ({
  Header,
  modules,
  homeId,
  shouldDisplayScrollToTop,
  onScroll: givenOnScroll,
  videoModuleId,
  statusBar,
}) => {
  const { offersModulesData } = useGetOffersData(modules.filter(isOffersModule))
  const { venuesModulesData } = useGetVenuesData(modules.filter(isVenuesModule))
  const logHasSeenAllModules = useFunctionOnce(async () =>
    analytics.logAllModulesSeen(modules.length)
  )
  const trackEventHasSeenAllModules = useFunctionOnce(() =>
    BatchUser.trackEvent(BatchEvent.hasSeenAllTheHomepage)
  )
  const showSkeleton = useShowSkeleton()
  const initialNumToRender = 10
  const maxToRenderPerBatch = 5
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const { height: screenHeight } = useWindowDimensions()
  const modulesIntervalId = useRef<NodeJS.Timeout>()
  const theme = useTheme()

  const flatListHeaderStyle = { zIndex: theme.zIndex.header }
  const { finish } = usePerformanceCalculation()
  const finishPerfHomeLoadingOnce = useFunctionOnce(() => finish(PERFORMANCE_HOME_LOADING))
  const finishPerfHomeCreationOnce = useFunctionOnce(() => finish(PERFORMANCE_HOME_CREATION))

  const modulesToDisplay = modules.slice(0, maxIndex)

  modulesToDisplay.forEach((module) => {
    if (isOffersModule(module)) {
      module.data = offersModulesData.find((mod) => mod.moduleId === module.id)
    }
    if (isVenuesModule(module)) {
      module.data = venuesModulesData.find((mod) => mod.moduleId === module.id)
    }
  })

  const scrollRef = useRef<FlatList>(null)
  useScrollToTop(scrollRef)

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Load more modules when we are one screen away from the end
      const { nativeEvent } = event
      if (isCloseToBottom({ ...nativeEvent, padding: screenHeight })) {
        if (maxIndex < modules.length) {
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

  const scrollListener = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (givenOnScroll) givenOnScroll(event)
    },
    [givenOnScroll]
  )

  const { onScroll, scrollButtonTransition } = useOnScroll(scrollListenerToThrottle, scrollListener)

  const onContentSizeChange = () => setIsLoading(false)

  useEffect(() => {
    finishPerfHomeCreationOnce()
    return () => clearInterval(modulesIntervalId.current)
  }, [finishPerfHomeCreationOnce])

  useEffect(() => {
    if (!showSkeleton) {
      finishPerfHomeLoadingOnce()
    }
  }, [showSkeleton, finishPerfHomeLoadingOnce])

  useEffect(() => {
    // We use this to load more modules, in case the content size doesn't change after the load triggered by onEndReached (i.e. no new modules were shown).
    modulesIntervalId.current = setInterval(() => {
      if (maxIndex < modules.length && isLoading) {
        setMaxIndex(maxIndex + maxToRenderPerBatch)
      } else {
        setIsLoading(false)
      }
    }, MODULES_TIMEOUT_VALUE_IN_MS)

    return () => {
      clearInterval(modulesIntervalId.current)
      modulesIntervalId.current = undefined
    }
  }, [modules.length, isLoading, maxIndex])

  const renderItem = useCallback(
    ({ item, index }: { item: HomepageModule; index: number }) =>
      renderModule({ item, index }, homeId, videoModuleId),
    [homeId, videoModuleId]
  )

  return (
    <Container>
      {showSkeleton ? (
        <ScrollView testID="homeScrollView" bounces={false} scrollEnabled={false}>
          {Header}
          <HomeBodyPlaceholder />
          <Spacer.TabBar />
        </ScrollView>
      ) : (
        <React.Fragment />
      )}
      <HomeBodyLoadingContainer hide={showSkeleton}>
        <FlatList
          ref={scrollRef}
          testID="homeBodyScrollView"
          onScroll={onScroll}
          data={modulesToDisplay}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            <FooterComponent hasShownAll={modulesToDisplay.length >= modules.length} />
          }
          ListHeaderComponent={Header}
          ListHeaderComponentStyle={flatListHeaderStyle}
          initialNumToRender={initialNumToRender}
          removeClippedSubviews={false}
          onContentSizeChange={onContentSizeChange}
          scrollEventThrottle={16}
          bounces
        />
        {shouldDisplayScrollToTop ? (
          <ScrollToTopContainer>
            <ScrollToTopButton
              transition={scrollButtonTransition}
              onPress={() => {
                scrollRef.current?.scrollToOffset({ offset: 0 })
              }}
            />
            <Spacer.BottomScreen />
          </ScrollToTopContainer>
        ) : null}
      </HomeBodyLoadingContainer>
      <Spacer.Column numberOfSpaces={6} />
      {statusBar ?? <React.Fragment />}
    </Container>
  )
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  const netInfo = useNetInfoContext()
  if (netInfo.isConnected) {
    return <OnlineHome {...props} />
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

const ScrollToTopContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))
