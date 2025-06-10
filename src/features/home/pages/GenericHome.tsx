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
import { getItemTypeFromModuleType } from 'features/home/helpers/getItemTypeFromModuleType'
import { useOnScroll } from 'features/home/pages/helpers/useOnScroll'
import {
  performanceMonitoringStoreActions,
  useInitialScreenName,
  useWasPerformanceMarkedThisSession,
} from 'features/home/pages/helpers/usePerformanceMonitoringStore'
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
import { markScreenInteractiveOnHomeLayout } from 'performance/markScreenInteractiveOnHomeLayout'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { logViewItem, setViewOfferTrackingFn } from 'shared/analytics/logViewItem'
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
import { ScreenSeenCount, getScreenSeenCount } from '../helpers/getScreenSeenCount'

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
}) => {
  setPlaylistTrackingInfo({
    index,
    moduleId,
    viewedAt: new Date(),
    items: viewableItems,
    itemType: getItemTypeFromModuleType(moduleType),
    extra: { homeEntryId },
    callId: '',
  })
}

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
    onModuleViewableItemsChanged={handleViewableItemsChanged}
  />
)

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

const OnlineHome: FunctionComponent<GenericHomeProps> = ({
  Header,
  HomeBanner,
  modules,
  homeId,
  thematicHeader,
  shouldDisplayScrollToTop,
  onScroll: givenOnScroll,
  videoModuleId,
  statusBar,
}) => {
  const initialScreenName = useInitialScreenName()
  const wasPerformanceMarkedThisSession = useWasPerformanceMarkedThisSession()
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
  const maxToRenderPerBatch = 5
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const { height: screenHeight } = useWindowDimensions()
  const modulesIntervalId = useRef<NodeJS.Timeout>()
  const theme = useTheme()

  const flatListHeaderStyle = { zIndex: theme.zIndex.header }

  const modulesToDisplay = modules.slice(0, maxIndex)

  modulesToDisplay.forEach((module) => {
    if (isOffersModule(module)) {
      module.data = offersModulesData.find((mod) => mod.moduleId === module.id)
    }
    if (isVenuesModule(module)) {
      module.data = venuesModulesData.find((mod) => mod.moduleId === module.id)
    }
  })

  const scrollRef = useRef<IOFlatListController>(null)
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
      clearInterval(modulesIntervalId.current)
      modulesIntervalId.current = undefined
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
      setPageTrackingInfo({
        pageId: homeId,
        pageLocation: name,
      })
    }, [homeId, name])
  )

  useAppStateChange(undefined, () => logViewItem(useOfferPlaylistTrackingStore.getState()))

  useFocusEffect(
    useCallback(() => {
      return () => {
        logViewItem(useOfferPlaylistTrackingStore.getState())
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
    buildModulesHandlingVideoCarouselPosition(modulesToDisplay, thematicHeader)
  const videoCarouselModules = modulesToDisplay.filter(isVideoCarouselModule)

  const shouldDisplayVideoInHeader =
    !thematicHeader && modulesToDisplay[0]?.type === HomepageModuleType.VideoCarouselModule

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
          onLayout={() => {
            if (!wasPerformanceMarkedThisSession) {
              markScreenInteractiveOnHomeLayout(initialScreenName)
              performanceMonitoringStoreActions.setWasPerformanceMarkedThisSession(true)
            }
          }}
          accessibilityRole={AccessibilityRole.MAIN}
          ref={scrollRef}
          testID="homeBodyScrollView"
          onScroll={onScroll}
          data={modulesToDisplayHandlingVideoCarousel}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            <FooterComponent hasShownAll={modulesToDisplay.length >= modules.length} />
          }
          ListHeaderComponent={ListHeader}
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
      {statusBar ?? null}
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
  marginVertical: getSpacing(6),
}))

const Container = styled(Page)({
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

const FlatListContainer = styled(IntersectionObserverFlatlist<HomepageModule>)({
  overflow: 'visible',
})

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})
