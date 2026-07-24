import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useGetHomepageById } from 'features/home/api/useHomepageData'
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
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import { locationActions, useUserLocation } from 'libs/locationV2/location.store'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { getSpacing, Typo } from 'ui/theme'

const SubHeader: FunctionComponent<{ homeId: string; thematicHeader?: ThematicHeader }> = ({
  homeId,
  thematicHeader,
}) => {
  const { designSystem } = useTheme()
  const MARGIN_TOP_HEADER = designSystem.size.spacing.xl

  const titles = useMobileFontScaleToDisplay({
    at200PercentZoom: (
      <TitlesContainer gap={designSystem.size.spacing.xs}>
        {thematicHeader?.subtitle ? <Typo.Title4>{thematicHeader.subtitle}</Typo.Title4> : null}
        <Typo.Title1>{thematicHeader?.title}</Typo.Title1>
      </TitlesContainer>
    ),

    default: undefined,
  })

  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.THEMATIC_HOME)
  if (thematicHeader?.type === ThematicHeaderType.Highlight) {
    if (Platform.OS === 'ios') {
      return (
        <IntroductionContainer marginTopHeader={MARGIN_TOP_HEADER}>
          {titles}
          {thematicHeader.introductionTitle && thematicHeader.introductionParagraph ? (
            <Introduction
              title={thematicHeader.introductionTitle}
              paragraph={thematicHeader.introductionParagraph}
            />
          ) : null}
        </IntroductionContainer>
      )
    }
    return (
      <React.Fragment>
        {Platform.OS === 'web' ? null : (
          <HeaderSpacerPlaceholder height={ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT} />
        )}
        <HighlightThematicHomeHeader {...thematicHeader} />
      </React.Fragment>
    )
  }

  if (thematicHeader?.type === ThematicHeaderType.Category) {
    if (Platform.OS === 'ios') {
      return (
        <React.Fragment>
          <Placeholder marginTopHeader={MARGIN_TOP_HEADER} />
          {titles}
        </React.Fragment>
      )
    }

    return (
      <CategoryThematicHomeHeader
        title={thematicHeader?.title}
        titleParts={thematicHeader.titleParts}
        subtitle={thematicHeader?.subtitle}
        color={thematicHeader?.color}
        imageUrl={thematicHeader.imageUrl}
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
  homeId: string
  thematicHeader?: ThematicHeader
}> = ({ homeId, thematicHeader }) => {
  const { designSystem, home } = useTheme()

  return (
    <React.Fragment>
      <SubHeader homeId={homeId} thematicHeader={thematicHeader} />
      <GeolocationBanner
        title="Géolocalise-toi"
        subtitle="pour trouver des offres autour de toi"
        analyticsFrom="thematicHome"
        // cannot be styled with styled-components because of a circular dependency
        style={{
          marginHorizontal: designSystem.size.spacing.xl,
          marginBottom: home.spaceBetweenModules,
        }}
      />
    </React.Fragment>
  )
}

export const ThematicHome: FunctionComponent = () => {
  const {
    params: {
      from,
      latitude,
      longitude,
      videoModuleId,
      homeId: requestHomeId,
      moduleId,
      moduleListId,
      moduleItemId,
    },
  } = useRoute<UseRouteType<'ThematicHome'>>()
  const { goBack } = useGoBack('ClubAdvices')
  const isFromDeeplink = from === 'deeplink'
  const { navigate } = useNavigation<UseNavigationType>()

  // if homepage fails to be fetched, `homeId` should not be `requestHomeId`, it would mislead tracker's data
  const { id: homeId, modules, thematicHeader } = useGetHomepageById(requestHomeId)
  const userLocation = useUserLocation()
  const { setLocationMode: setSelectedLocationMode, setPlace } = locationActions
  const isLocated = !!userLocation

  const { onScroll, headerTransition, gradientTranslation, viewTranslation, imageAnimatedHeight } =
    useOpacityTransition({
      headerHeight:
        thematicHeader?.type === ThematicHeaderType.Highlight
          ? getSpacing(ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT)
          : getSpacing(ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT),
    })

  useEffect(() => {
    if (!homeId) {
      return
    }
    void analytics.logConsultThematicHome({
      homeEntryId: homeId,
      from,
      moduleId,
      moduleListId,
      moduleItemId,
    })
  }, [from, homeId, moduleId, moduleItemId, moduleListId])

  const hasLocationUrlParams = !!(latitude && longitude)

  useEffect(() => {
    if (hasLocationUrlParams) {
      setSelectedLocationMode(LocationMode.AROUND_PLACE)
      setPlace({
        label: 'Géolocalisation',
        geolocation: {
          latitude,
          longitude,
        },
        info: '',
      })
    }
  }, [hasLocationUrlParams, latitude, longitude, setPlace, setSelectedLocationMode])

  const handleBackPress = () => {
    isFromDeeplink ? navigate(...homeNavigationConfig) : goBack()
  }

  const getPlaceholderHeight = () => {
    if (thematicHeader?.type === ThematicHeaderType.Category) {
      return 0
    }
    return isLocated ? getSpacing(150) : getSpacing(200)
  }
  const Footer = useMobileFontScaleToDisplay({
    default: undefined,
    at200PercentZoom: <FooterPlaceholder height={getPlaceholderHeight()} />,
  })

  return (
    <Page>
      <GenericHome
        modules={modules}
        homeId={homeId}
        thematicHeader={thematicHeader}
        Header={<ThematicHeaderWithGeolocBanner homeId={homeId} thematicHeader={thematicHeader} />}
        shouldDisplayScrollToTop
        onScroll={onScroll}
        videoModuleId={videoModuleId}
        footer={Footer}
      />

      {/* ThematicHomeHeader is called after Body to implement the BlurView for iOS */}
      <ThematicHomeHeader
        thematicHeader={thematicHeader}
        headerTransition={headerTransition}
        homeId={homeId}
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
                homeId={homeId}
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

const FooterPlaceholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const AnimatedHeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

const TitlesContainer = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const AnimatedHeader = Animated.createAnimatedComponent(AnimatedHeaderContainer)

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})

const IntroductionContainer = styled.View<{ marginTopHeader: number }>(({ marginTopHeader }) => ({
  marginTop: getSpacing(ANIMATED_HIGHLIGHT_HEADER_PLACEHOLDER_HEIGHT) + marginTopHeader,
}))

const Placeholder = styled.View<{ marginTopHeader: number }>(({ marginTopHeader }) => ({
  height: getSpacing(ANIMATED_CATEGORY_HEADER_PLACEHOLDER_HEIGHT) + marginTopHeader,
}))

const HeaderSpacerPlaceholder = styled.View<{ height: number }>(({ height }) => ({
  height: getSpacing(height),
}))
