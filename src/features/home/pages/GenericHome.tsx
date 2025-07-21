import { useFocusEffect, useRoute, useScrollToTop } from '@react-navigation/native'
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
import { getItemTypeFromModuleType } from 'features/home/helpers/getItemTypeFromModuleType'
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
import { useAppStateChange } from 'libs/appState'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchEventAttributes, BatchProfile } from 'libs/react-native-batch'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMarkScreenInteractive } from 'performance/useMarkScreenInteractive'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { logPlaylistDebug, logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
import {
  resetPageTrackingInfo,
  setPageTrackingInfo,
  setPlaylistTrackingInfo,
  useOfferPlaylistTrackingStore,
} from 'store/tracking/playlistTrackingStore'
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

const handleViewableItemsChanged: ModuleViewableItemsChangedHandler = ({
  index,
  moduleId,
  moduleType,
  viewableItems,
  homeEntryId,
  callId,
}) => {
  const trackingData = {
    index,
    moduleId,
    viewedAt: new Date(),
    items: viewableItems,
    itemType: getItemTypeFromModuleType(moduleType),
    extra: { homeEntryId },
    callId: callId ?? '',
  }

  logPlaylistDebug('GENERIC_HOME', 'Module viewable items changed', {
    moduleId,
    moduleType,
    index,
    itemsCount: viewableItems.length,
    items: viewableItems,
    callId: callId ?? '',
  })

  setPlaylistTrackingInfo(trackingData)
}

const renderModule = (
  { item, index }: { item: HomepageModule; index: number },
  homeId: string,
  videoModuleId?: string
) => {
  logPlaylistDebug('GENERIC_HOME', `Rendering module ${item.id} at index ${index}`, {
    moduleType: item.type,
    hasData: !!(isOffersModule(item) || isVenuesModule(item)),
  })

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
  const modulesIntervalId = useRef<NodeJS.Timeout>(null)
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
  const { name } = useRoute()

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

  useEffect(() => {
    setViewOfferTrackingFn(analytics.logViewItem)
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!homeId || !name) {
        return
      }
      logPlaylistDebug('GENERIC_HOME', 'Setting page tracking info', {
        pageId: homeId,
        pageLocation: name,
      })
      setPageTrackingInfo({
        pageId: homeId,
        pageLocation: name,
      })
    }, [homeId, name])
  )

  useAppStateChange(undefined, () => {
    const state = useOfferPlaylistTrackingStore.getState()

    if (state?.pageId && state?.pageLocation && state?.playlists) {
      logPlaylistDebug('GENERIC_HOME', 'App state changed - sending playlist stats', {
        pageId: state.pageId,
        pageLocation: state.pageLocation,
        playlistsCount: state.playlists.length,
        playlists: state.playlists.map((p) => ({
          moduleId: p.moduleId,
          itemType: p.itemType,
          itemsCount: p.items.length,
          index: p.index,
        })),
      })
    }
    logViewItem(state)
  })

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsLoading(false)
        const state = useOfferPlaylistTrackingStore.getState()

        if (state?.pageId && state?.pageLocation && state?.playlists) {
          logPlaylistDebug('GENERIC_HOME', 'Focus lost - sending final playlist stats', {
            pageId: state.pageId,
            pageLocation: state.pageLocation,
            playlistsCount: state.playlists.length,
            playlists: state.playlists.map((p) => ({
              moduleId: p.moduleId,
              itemType: p.itemType,
              itemsCount: p.items.length,
              index: p.index,
              viewedAt: p.viewedAt,
            })),
          })
        }

        logViewItem(state)

        logPlaylistDebug('GENERIC_HOME', 'Resetting page tracking info')
        resetPageTrackingInfo()
      }
    }, [])
  )

  const renderItem = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ item, index }: { item: any; index: number }) =>
      renderModule({ item, index }, homeId, videoModuleId),
    [homeId, videoModuleId]
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
