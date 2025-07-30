import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import {
  MOBILE_HEADER_HEIGHT as ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT,
  AnimatedCategoryThematicHomeHeader,
} from 'features/home/components/headers/AnimatedCategoryThematicHomeHeader'
import {
  MOBILE_HEADER_HEIGHT as ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT,
  AnimatedHighlightThematicHomeHeader,
} from 'features/home/components/headers/AnimatedHighlightThematicHomeHeader'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { Introduction } from 'features/home/components/headers/highlightThematic/Introduction'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { Page } from 'ui/pages/Page'
import { getSpacing, Spacer } from 'ui/theme'

const MARGIN_TOP_HEADER = 6

const SubHeader: FunctionComponent<{ thematicHeader?: ThematicHeader }> = ({ thematicHeader }) => {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.THEMATIC_HOME)
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
        color={thematicHeader?.color}
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
  thematicHeader?: ThematicHeader
}> = ({ thematicHeader, isLocated }) => (
  <React.Fragment>
    <SubHeader thematicHeader={thematicHeader} />
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
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { goBack } = useGoBack('Chronicles')
  const { navigate } = useNavigation<UseNavigationType>()
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

  const { onScroll, headerTransition, gradientTranslation, viewTranslation, imageAnimatedHeight } =
    useOpacityTransition({
      headerHeight:
        thematicHeader?.type === ThematicHeaderType.Highlight
          ? getSpacing(ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT)
          : getSpacing(ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT),
    })

  const moduleItemId =
    'moduleItemId' in params && typeof params.moduleItemId === 'string'
      ? params.moduleItemId
      : undefined
  useEffect(() => {
    if (!id) {
      return
    }
    analytics.logConsultThematicHome({
      homeEntryId: id,
      from: params.from,
      moduleId: params.moduleId,
      moduleListId: params.moduleListId,
      moduleItemId,
    })
  }, [id, params.from, params.homeId, params.moduleId, moduleItemId, params.moduleListId])

  useEffect(() => {
    switch (true) {
      case isFromDeeplink && hasGeolocPosition:
        setSelectedLocationMode(LocationMode.AROUND_ME)
        setPlace(null)
        onResetPlace()
        break
      case selectedLocationMode === LocationMode.AROUND_PLACE:
        setSelectedLocationMode(LocationMode.AROUND_PLACE)
        break
      case selectedLocationMode === LocationMode.AROUND_ME || hasGeolocPosition:
        setSelectedLocationMode(LocationMode.AROUND_ME)
        break
      default:
        setSelectedLocationMode(LocationMode.EVERYWHERE)
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition, isFromDeeplink])

  const handleBackPress = () => {
    params.from === 'chronicles' ? goBack() : navigate(...homeNavigationConfig)
  }

  return (
    <Page>
      <GenericHome
        modules={modules}
        homeId={id}
        thematicHeader={thematicHeader}
        Header={
          <ThematicHeaderWithGeolocBanner thematicHeader={thematicHeader} isLocated={isLocated} />
        }
        shouldDisplayScrollToTop
        onScroll={onScroll}
        videoModuleId={params.videoModuleId}
      />
      {/* ThematicHomeHeader is called after Body to implement the BlurView for iOS */}
      <ThematicHomeHeader
        thematicHeader={thematicHeader}
        headerTransition={headerTransition}
        homeId={params.homeId}
        onBackPress={handleBackPress}
      />
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
              />
            </AnimatedHeader>
          ) : null}
        </React.Fragment>
      ) : null}
    </Page>
  )
}

const AnimatedHeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

const AnimatedHeader = Animated.createAnimatedComponent(AnimatedHeaderContainer)

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})

const GeolocationBannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.home.spaceBetweenModules,
}))
