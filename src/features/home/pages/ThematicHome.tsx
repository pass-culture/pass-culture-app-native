import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
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
import { GeolocPermissionState } from 'libs/location'
import { useLocation } from 'libs/location/LocationWrapper'
import { startTransaction } from 'shared/performance/transactions'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { getSpacing, Spacer } from 'ui/theme'

const MARGIN_TOP_HEADER = 6

const SubHeader: FunctionComponent<{ thematicHeader?: ThematicHeader }> = ({ thematicHeader }) => {
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
  thematicHeader?: ThematicHeader
  isLocated: boolean
}> = ({ thematicHeader, isLocated }) => (
  <React.Fragment>
    <SubHeader thematicHeader={thematicHeader} />
    {isLocated ? null : (
      <GeolocationBannerContainer testID="geolocationBanner">
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="pour trouver des offres autour de toi"
        />
      </GeolocationBannerContainer>
    )}
  </React.Fragment>
)

const ThematicHeaderWithSystemBanner: FunctionComponent<{
  thematicHeader?: ThematicHeader
  isLocated: boolean
  onPress: VoidFunction
}> = ({ thematicHeader, isLocated, onPress }) => {
  return (
    <React.Fragment>
      <SubHeader thematicHeader={thematicHeader} />
      {isLocated ? null : (
        <GeolocationBannerContainer>
          <SystemBanner
            LeftIcon={<LocationIcon />}
            title="Géolocalise-toi"
            subtitle="pour trouver des offres autour de toi"
            accessibilityLabel="Active ta géolocalisation"
            onPress={onPress}
          />
        </GeolocationBannerContainer>
      )}
    </React.Fragment>
  )
}

export const ThematicHome: FunctionComponent = () => {
  const startPerfHomeLoadingOnce = useFunctionOnce(() => startTransaction(PERFORMANCE_HOME_LOADING))
  const startPerfHomeCreationOnce = useFunctionOnce(() =>
    startTransaction(PERFORMANCE_HOME_CREATION)
  )
  startPerfHomeCreationOnce()
  startPerfHomeLoadingOnce()
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}
  const { userLocation, permissionState, requestGeolocPermission, showGeolocPermissionModal } =
    useLocation()
  const isLocated = !!userLocation
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)

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

  const onPressSystemBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return (
    <Container>
      <GenericHome
        modules={modules}
        homeId={id}
        thematicHeader={thematicHeader}
        Header={
          <React.Fragment>
            {enableSystemBanner ? (
              <ThematicHeaderWithSystemBanner
                thematicHeader={thematicHeader}
                isLocated={isLocated}
                onPress={onPressSystemBanner}
              />
            ) : (
              <ThematicHeaderWithGeolocBanner
                thematicHeader={thematicHeader}
                isLocated={isLocated}
              />
            )}
            {Platform.OS === 'ios' ? null : <SubscribeButtonWithModals homeId={params.homeId} />}
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
              />

              <SubscribeButtonWithModals homeId={params.homeId} />
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

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.colors.secondaryLight200,
}))``
