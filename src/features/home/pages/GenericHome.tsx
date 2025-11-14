import { useScrollToTop } from '@react-navigation/native'
import { without } from 'lodash'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  IOFlatList as IntersectionObserverFlatlist,
  IOFlatListController,
} from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { VideoCarouselModule } from 'features/home/components/modules/video/VideoCarouselModule'
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData'
import { useOnScroll } from 'features/home/pages/helpers/useOnScroll'
import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import {
  HomepageModule,
  HomepageModuleType,
  isOffersModule,
  isVenuesModule,
  isVideoCarouselModule,
  ModuleViewableItemsChangedHandler,
  ThematicHeader,
} from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchEventAttributes, BatchProfile } from 'libs/react-native-batch'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMarkScreenInteractive } from 'performance/useMarkScreenInteractive'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { usePageTracking, createViewableItemsHandler } from 'shared/tracking/usePageTracking'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spinner } from 'ui/components/Spinner'
import { Page } from 'ui/pages/Page'
import { getSpacing, Spacer } from 'ui/theme'

import { createInMemoryScreenSeenCountTriggerStorage } from '../api/inMemoryScreenSeenTriggerStorage'
import { getScreenSeenCount, ScreenSeenCount } from '../helpers/getScreenSeenCount'

type GenericHomeProps = {
  Header: React.JSX.Element
  HomeBanner?: React.JSX.Element
  modules: HomepageModule[]
  homeId: string
  thematicHeader?: ThematicHeader
  shouldDisplayScrollToTop?: boolean
  onScroll?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
  videoModuleId?: string
  statusBar?: React.JSX.Element
}

const keyExtractor = (item: HomepageModule) => item.id

const renderModule = (
  { item, index }: { item: HomepageModule; index: number },
  homeId: string,
  handleViewableItemsChanged: ModuleViewableItemsChangedHandler,
  videoModuleId?: string
) => {
  return (
    <HomeModule
      item={item}
      index={index}
      homeEntryId={homeId}
      data={isOffersModule(item) || isVenuesModule(item) ? item.data : undefined}
      videoModuleId={videoModuleId}
      onModuleViewableItemsChanged={handleViewableItemsChanged}
    />
  )
}

const FooterComponent = ({ hasShownAll }: { hasShownAll: boolean }) => {
  if (hasShownAll && Platform.OS === 'web') {
    return (
      <React.Fragment>
        <footer>
          <AccessibilityFooter />
        </footer>
        <Spacer.TabBar />
      </React.Fragment>
    )
  }
  if (!hasShownAll) {
    return (
      <React.Fragment>
        <FooterContainer>
          <Spinner testID="spinner" />
        </FooterContainer>
        <Spacer.TabBar />
      </React.Fragment>
    )
  }
  return <Spacer.TabBar />
}

const buildModulesHandlingVideoCarouselPosition = (
  modules: HomepageModule[],
  thematicHeader?: ThematicHeader
) => {
  if (thematicHeader) return modules
  if (modules[0] && modules[0].type === HomepageModuleType.VideoCarouselModule) {
    return without(modules, modules[0])
  }
  return modules
}

const MODULES_TIMEOUT_VALUE_IN_MS = 3000

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({
  Header,
  HomeBanner,
  modules,
  homeId,
  thematicHeader,
  shouldDisplayScrollToTop,
  onScroll: givenOnScroll,
  videoModuleId,
  statusBar,
}) {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.HOME)
  useMarkScreenInteractive()
  const offersModulesData = useGetOffersDataQuery(modules.filter(isOffersModule))
  const { venuesModulesData } = useGetVenuesData(modules.filter(isVenuesModule))
  const logHasSeenAllModules = useFunctionOnce(async () =>
    analytics.logAllModulesSeen(modules.length)
  )

  const trackEventHasSeenAllModules = useFunctionOnce(() => {
    const attributes = new BatchEventAttributes()
    attributes.put('home_id', homeId)
    attributes.put(
      'home_type',
      thematicHeader ? `thematicHome - ${thematicHeader.type}` : 'mainHome'
    )
    BatchProfile.trackEvent(BatchEvent.hasSeenAllTheHomepage, attributes)
  })

  const showSkeleton = useShowSkeleton()
  const initialNumToRender = 10
  const maxToRenderPerBatch = 6
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const { height: screenHeight } = useWindowDimensions()
  const modulesIntervalId = useRef<number>(null)
  const { zIndex } = useTheme()

  const flatListHeaderStyle = { zIndex: zIndex.header }

  const enrichedModules = useMemo(
    () => enrichModulesWithData(modules, offersModulesData, venuesModulesData).slice(0, maxIndex),
    [modules, offersModulesData, venuesModulesData, maxIndex]
  )

  const scrollRef = useRef<IOFlatListController>(null)
  useScrollToTop(scrollRef as React.RefObject<IOFlatListController>)

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
      if (isCloseToBottom(nativeEvent) && enrichedModules.length === modules.length) {
        trackEventHasSeenAllModules()
        logHasSeenAllModules()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modules.length, enrichedModules.length]
  )
  const { height } = useWindowDimensions()
  const { isLoggedIn } = useAuthContext()
  const { current: triggerStorage } = useRef(createInMemoryScreenSeenCountTriggerStorage())

  const triggerHasSeenEnoughHomeContent = async (screenSeenCount: ScreenSeenCount) => {
    const attributes = new BatchEventAttributes()
    attributes.put('screen_seen_count', screenSeenCount)
    attributes.put('home_id', homeId)
    attributes.put(
      'home_type',
      thematicHeader ? `thematicHome - ${thematicHeader.type}` : 'mainHome'
    )
    BatchProfile.trackEvent(BatchEvent.hasSeenEnoughHomeContent, attributes)
  }

  const { checkTrigger } = getScreenSeenCount({
    isLoggedIn,
    screenHeight: height,
    onTrigger: triggerHasSeenEnoughHomeContent,
    triggerStorage,
  })

  const scrollListener = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (givenOnScroll) givenOnScroll(event)

      checkTrigger(event.nativeEvent.contentOffset.y)
    },
    [givenOnScroll, checkTrigger]
  )

  const { onScroll, scrollButtonTransition } = useOnScroll(scrollListenerToThrottle, scrollListener)

  const onContentSizeChange = () => setIsLoading(false)

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
      if (modulesIntervalId.current) {
        clearInterval(modulesIntervalId.current)
        modulesIntervalId.current = null
      }
    }
  }, [modules.length, isLoading, maxIndex])

  const pageTracking = usePageTracking({
    pageName: 'Home',
    pageLocation: 'home',
    pageId: homeId || 'home_unknown',
  })

  // Create handler for modules with the new tracking system
  const handleViewableItemsChanged = useMemo(
    () => createViewableItemsHandler(pageTracking.trackViewableItems),
    [pageTracking.trackViewableItems]
  )

  const renderItem = useCallback(
    ({ item, index }: { item: HomepageModule; index: number }) =>
      renderModule({ item, index }, homeId, handleViewableItemsChanged, videoModuleId),
    [homeId, handleViewableItemsChanged, videoModuleId]
  )

  const modulesToDisplayHandlingVideoCarousel: HomepageModule[] =
    buildModulesHandlingVideoCarouselPosition(enrichedModules, thematicHeader)
  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule)

  const shouldDisplayVideoInHeader =
    !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule

  const ListHeader = useMemo(
    () => (
      <View testID="listHeader">
        {Header}
        <Spacer.Column numberOfSpaces={6} />
        {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
          <VideoCarouselModule
            index={0}
            homeEntryId={homeId}
            {...videoCarouselModules[0]}
            autoplay
          />
        ) : null}
        <PageContent>{HomeBanner}</PageContent>
      </View>
    ),
    [Header, shouldDisplayVideoInHeader, videoCarouselModules, homeId, HomeBanner]
  )

  return (
    <Container>
      {showSkeleton ? (
        <ScrollView testID="homeScrollView" bounces={false} scrollEnabled={false}>
          {Header}
          <HomeBodyPlaceholder />
          <Spacer.TabBar />
        </ScrollView>
      ) : null}
      <HomeBodyLoadingContainer hide={showSkeleton}>
        <FlatListContainer
          accessibilityRole={AccessibilityRole.MAIN}
          ref={scrollRef}
          testID="homeBodyScrollView"
          onScroll={onScroll}
          data={modulesToDisplayHandlingVideoCarousel}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          windowSize={5}
          maxToRenderPerBatch={maxToRenderPerBatch}
          ListFooterComponent={
            <FooterComponent hasShownAll={enrichedModules.length >= modules.length} />
          }
          ListHeaderComponent={ListHeader}
          ListHeaderComponentStyle={flatListHeaderStyle}
          initialNumToRender={initialNumToRender}
          updateCellsBatchingPeriod={200}
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
      {statusBar ?? null}
    </Container>
  )
})

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  const netInfo = useNetInfoContext()

  if (netInfo.isConnected) {
    return <OnlineHome {...props} />
  }
  return <OfflinePage />
}

const HomeBodyLoadingContainer = styled.View<{ hide: boolean }>(({ hide, theme }) => ({
  height: hide ? 0 : '100%',
  overflow: 'hidden',
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const Container = styled(Page)({
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
})

const FooterContainer = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.s,
  paddingBottom: theme.designSystem.size.spacing.xxxl,
}))

const ScrollToTopContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

// @ts-expect-error - type incompatibility with React 19
const FlatListContainer = styled(IntersectionObserverFlatlist<HomepageModule>)({
  overflow: 'visible',
})

const PageContent = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
