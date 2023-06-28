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

import { useGetOffersData } from 'features/home/api/useGetOffersData'
import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { useOnScroll } from 'features/home/pages/helpers/useOnScroll'
import { HomepageModule, isOffersModule, isVenuesModule } from 'features/home/types'
import { Shake } from 'features/shake/Shake'
import { ShakeIcon } from 'features/shake/ShakeIcon'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { InfoBanner } from 'ui/components/InfoBanner'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spinner } from 'ui/components/Spinner'
import { OtherOffer } from 'ui/svg/icons/OtherOffer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type GenericHomeProps = {
  Header: React.JSX.Element
  modules: HomepageModule[]
  homeId: string
  shouldDisplayScrollToTop?: boolean
  onScroll?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
}
const keyExtractor = (item: HomepageModule) => item.id

const renderModule = ({ item, index }: { item: HomepageModule; index: number }, homeId: string) => (
  <HomeModule
    item={item}
    index={index}
    homeEntryId={homeId}
    data={isOffersModule(item) || isVenuesModule(item) ? item.data : undefined}
  />
)

const FooterComponent = ({ hasShownAll }: { hasShownAll: boolean }) => {
  return (
    <React.Fragment>
      <Shake />
      <BannerContainer>
        {Platform.OS !== 'web' ? (
          <BannerWithBackground leftIcon={OtherOffer} navigateTo={{ screen: 'ShakeStart' }}>
            <StyledButtonText>En manque d’inspi&nbsp;?</StyledButtonText>
            <StyledBody>Clique ici pour découvrir ta sélection mystère du jour&nbsp;!</StyledBody>
          </BannerWithBackground>
        ) : (
          <InfoBanner
            icon={ShakeIcon}
            message={`En manque d’inspi\u00a0?${LINE_BREAK}Secoue ton téléphone et découvre ta sélection mystère du jour\u00a0!`}
          />
        )}
      </BannerContainer>
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
  onScroll: givenOnScroll,
}) => {
  const { offersModulesData } = useGetOffersData(modules.filter(isOffersModule))
  const { venuesModulesData } = useGetVenuesData(modules.filter(isVenuesModule))
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

  const scrollListener = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (givenOnScroll) givenOnScroll(event)
    },
    [givenOnScroll]
  )

  const { onScroll, scrollButtonTransition } = useOnScroll(scrollListenerToThrottle, scrollListener)

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
    ({ item, index }: { item: HomepageModule; index: number }) =>
      renderModule({ item, index }, homeId),
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
          ListFooterComponent={
            <FooterComponent hasShownAll={modulesToDisplay.length >= modules.length} />
          }
          ListHeaderComponent={Header}
          initialNumToRender={initialNumToRender}
          removeClippedSubviews={false}
          onContentSizeChange={onContentSizeChange}
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

const BannerContainer = styled.View({
  margin: getSpacing(6),
})

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
