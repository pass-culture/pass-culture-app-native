import { useScrollToTop } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import styled from 'styled-components/native'

import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { useOnScroll } from 'features/home/pages/helpers/useOnScroll'
import { HomepageModule } from 'features/home/types'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spinner } from 'ui/components/Spinner'
import { getSpacing, Spacer } from 'ui/theme'

type GenericHomeProps = {
  Header: JSX.Element
  modules: HomepageModule[]
  homeId: string
  shouldDisplayScrollToTop?: boolean
}
const keyExtractor = (item: HomepageModule) => item.id

const renderModule = ({ item, index }: { item: HomepageModule; index: number }, homeId: string) => (
  <HomeModule item={item} index={index} homeEntryId={homeId} />
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

export const OnlineHome: FunctionComponent<GenericHomeProps> = ({
  Header,
  modules,
  homeId,
  shouldDisplayScrollToTop,
}) => {
  const logHasSeenAllModules = useFunctionOnce(() => analytics.logAllModulesSeen(modules.length))
  const trackEventHasSeenAllModules = useFunctionOnce(() =>
    BatchUser.trackEvent(BatchEvent.hasSeenAllTheHomepage)
  )
  const showSkeleton = useShowSkeleton()
  const initialNumToRender = 10
  const maxToRenderPerBatch = 5
  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const { height: screenHeight } = useWindowDimensions()
  const modulesIntervalId = useRef(0)

  const modulesToDisplay = Platform.OS === 'web' ? modules : modules.slice(0, maxIndex)

  const scrollRef = useRef<FlatList>(null)
  useScrollToTop(scrollRef)

  const scrollListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Load more modules when we are one screen away from the end
      if (isCloseToBottom({ ...nativeEvent, padding: screenHeight })) {
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
  const { onScroll, scrollButtonTransition } = useOnScroll(scrollListener)

  const onContentSizeChange = () => setIsLoading(false)

  useEffect(() => {
    return () => clearInterval(modulesIntervalId.current)
  }, [])

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
      modulesIntervalId.current = 0
    }
  }, [modules.length, isLoading, maxIndex])

  const renderItem = useCallback(
    ({ item, index }) => renderModule({ item, index }, homeId),
    [homeId]
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
          ListFooterComponent={<FooterComponent hasShownAll={maxIndex >= modules.length} />}
          ListHeaderComponent={Header}
          initialNumToRender={initialNumToRender}
          removeClippedSubviews={false}
          onContentSizeChange={onContentSizeChange}
          bounces
          scrollEventThrottle={200} // Fire onscroll event when scrolling every 200ms
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
