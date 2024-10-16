import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import {
  AnimatedCategoryThematicHomeHeader,
  MOBILE_HEADER_HEIGHT as ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT,
} from 'features/home/components/headers/AnimatedCategoryThematicHomeHeader'
import {
  AnimatedHighlightThematicHomeHeader,
  MOBILE_HEADER_HEIGHT as ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT,
} from 'features/home/components/headers/AnimatedHighlightThematicHomeHeader'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { Introduction } from 'features/home/components/headers/highlightThematic/Introduction'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'
import { startTransaction } from 'shared/performance/transactions'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { getSpacing, Spacer } from 'ui/theme'

const MARGIN_TOP_HEADER = 6

const SubHeader: FunctionComponent<{ thematicHeader?: ThematicHeader; homeId: string }> = ({
  thematicHeader,
  homeId,
}) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight) {
    if (Platform.OS === 'ios') {
      return (
        <React.Fragment>
          <Spacer.Column
            numberOfSpaces={ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT + MARGIN_TOP_HEADER}
          />
          {thematicHeader.introductionTitle && thematicHeader.introductionParagraph ? (
            <Introduction
              title={thematicHeader.introductionTitle}
              paragraph={thematicHeader.introductionParagraph}
            />
          ) : null}
        </React.Fragment>
      )
    }
    return <HighlightThematicHomeHeader {...thematicHeader} />
  }

  if (thematicHeader?.type === ThematicHeaderType.Category) {
    if (Platform.OS === 'ios') {
      return (
        <Spacer.Column
          numberOfSpaces={ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT + MARGIN_TOP_HEADER}
        />
      )
    }

    return (
      <CategoryThematicHomeHeader
        title={thematicHeader?.title}
        subtitle={thematicHeader?.subtitle}
        imageUrl={thematicHeader?.imageUrl}
        color={thematicHeader?.color}
        homeId={homeId}
      />
    )
  }

  return (
    <ListHeaderContainer>
      <DefaultThematicHomeHeader
        headerTitle={thematicHeader?.title}
        headerSubtitle={thematicHeader?.subtitle}
      />
    </ListHeaderContainer>
  )
}

const ThematicHeaderWithGeolocBanner: FunctionComponent<{
  isLocated: boolean
  homeId: string
  thematicHeader?: ThematicHeader
}> = ({ thematicHeader, isLocated, homeId }) => (
  <React.Fragment>
    <SubHeader thematicHeader={thematicHeader} homeId={homeId} />
    {isLocated ? null : (
      <GeolocationBannerContainer>
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="pour trouver des offres autour de toi"
          analyticsFrom="thematicHome"
        />
      </GeolocationBannerContainer>
    )}
  </React.Fragment>
)

export const ThematicHome: FunctionComponent = () => {
  const startPerfHomeLoadingOnce = useFunctionOnce(() => startTransaction(PERFORMANCE_HOME_LOADING))
  const startPerfHomeCreationOnce = useFunctionOnce(() =>
    startTransaction(PERFORMANCE_HOME_CREATION)
  )
  startPerfHomeCreationOnce()
  startPerfHomeLoadingOnce()
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const isFromDeeplink = params.from === 'deeplink'
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}
  const {
    userLocation,
    hasGeolocPosition,
    selectedLocationMode,
    setSelectedLocationMode,
    setPlace,
    onResetPlace,
  } = useLocation()
  const isLocated = !!userLocation
  const enableAppV2Header = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_THEMATIC_HOME_HEADER)

  const { onScroll, headerTransition, imageAnimatedHeight, gradientTranslation, viewTranslation } =
    useOpacityTransition({
      headerHeight:
        thematicHeader?.type === ThematicHeaderType.Highlight
          ? getSpacing(ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT)
          : getSpacing(ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT),
    })

  useEffect(() => {
    if (id) {
      analytics.logConsultHome({
        homeEntryId: id,
        from: params.from,
        moduleId: params.moduleId,
        moduleListId: params.moduleListId,
      })
    }
  }, [id, params.from, params.moduleId, params.moduleListId])

  useEffect(() => {
    switch (true) {
      case selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition:
        setSelectedLocationMode(LocationMode.AROUND_ME)
        break
      case hasGeolocPosition && isFromDeeplink:
        setSelectedLocationMode(LocationMode.AROUND_ME)
        setPlace(null)
        onResetPlace()
        break
      default:
        setSelectedLocationMode(LocationMode.EVERYWHERE)
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition, isFromDeeplink])

  const shouldDisplaySubscribeButton = Platform.OS !== 'ios' && !enableAppV2Header

  return (
    <Container>
      <GenericHome
        modules={modules}
        homeId={id}
        thematicHeader={thematicHeader}
        Header={
          <React.Fragment>
            <ThematicHeaderWithGeolocBanner
              thematicHeader={thematicHeader}
              isLocated={isLocated}
              homeId={id}
            />
            {shouldDisplaySubscribeButton ? (
              <SubscribeButtonContainer>
                <SubscribeButtonWithModals homeId={params.homeId} />
              </SubscribeButtonContainer>
            ) : null}
          </React.Fragment>
        }
        shouldDisplayScrollToTop
        onScroll={onScroll}
        videoModuleId={params.videoModuleId}
      />
      {/* ThematicHomeHeader is called after Body to implement the BlurView for iOS */}
      <ThematicHomeHeader title={thematicHeader?.title} headerTransition={headerTransition} />
      {/* Animated header is called only for iOS */}
      {Platform.OS === 'ios' ? (
        <React.Fragment>
          {thematicHeader?.type === ThematicHeaderType.Highlight ? (
            <AnimatedHeader style={{ transform: [{ translateY: viewTranslation }] }}>
              <AnimatedHighlightThematicHomeHeader
                {...thematicHeader}
                gradientTranslation={gradientTranslation}
                imageAnimatedHeight={imageAnimatedHeight}
              />
            </AnimatedHeader>
          ) : null}
          {thematicHeader?.type === ThematicHeaderType.Category ? (
            <AnimatedHeader style={{ transform: [{ translateY: viewTranslation }] }}>
              <AnimatedCategoryThematicHomeHeader
                {...thematicHeader}
                gradientTranslation={gradientTranslation}
                imageAnimatedHeight={imageAnimatedHeight}
                homeId={id}
              />
              {enableAppV2Header ? null : (
                <SubscribeButtonContainer>
                  <SubscribeButtonWithModals homeId={params.homeId} />
                </SubscribeButtonContainer>
              )}
            </AnimatedHeader>
          ) : null}
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const AnimatedHeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

const AnimatedHeader = Animated.createAnimatedComponent(AnimatedHeaderContainer)

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})

const GeolocationBannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  marginBottom: theme.home.spaceBetweenModules,
}))

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  right: getSpacing(4),
  top: getSpacing(40),
})
