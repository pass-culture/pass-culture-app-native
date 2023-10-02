import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { AnimatedHighlightThematicHomeHeader } from 'features/home/components/headers/AnimatedHighlightThematicHomeHeader'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { getSpacing, Spacer } from 'ui/theme'

const ANIMATED_HEADER_PLACEHOLDER_HEIGHT = 76

const SubHeader: FunctionComponent<{ thematicHeader?: ThematicHeader }> = ({ thematicHeader }) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight) {
    if (Platform.OS === 'ios') {
      return <Spacer.Column numberOfSpaces={ANIMATED_HEADER_PLACEHOLDER_HEIGHT} />
    }
    return <HighlightThematicHomeHeader {...thematicHeader} />
  }

  if (thematicHeader?.type === ThematicHeaderType.Category)
    return (
      <CategoryThematicHomeHeader
        title={thematicHeader?.title}
        subtitle={thematicHeader?.subtitle}
        imageUrl={thematicHeader?.imageUrl}
      />
    )

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
    {!isLocated && (
      <GeolocationBannerContainer>
        <GeolocationBanner
          title="Géolocalise-toi"
          subtitle="pour trouver des offres autour de toi"
        />
      </GeolocationBannerContainer>
    )}
  </React.Fragment>
)

export const ThematicHome: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}
  const { position } = useHomePosition()
  const isLocated = !!position

  const AnimatedHeader = Animated.createAnimatedComponent(AnimatedHeaderContainer)

  const { onScroll, headerTransition, imageAnimatedHeight, gradientTranslation, viewTranslation } =
    useOpacityTransition()

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

  return (
    <Container>
      <GenericHome
        modules={modules}
        homeId={id}
        Header={
          <ThematicHeaderWithGeolocBanner thematicHeader={thematicHeader} isLocated={isLocated} />
        }
        shouldDisplayScrollToTop
        onScroll={onScroll}
        videoModuleId={params.videoModuleId}
      />
      {/* ThematicHomeHeader is called after Body to implement the BlurView for iOS */}
      <ThematicHomeHeader title={thematicHeader?.title} headerTransition={headerTransition} />
      {/* Animated header is called only for iOS */}
      {Platform.OS === 'ios' && (
        <React.Fragment>
          {thematicHeader?.type === ThematicHeaderType.Highlight && (
            <AnimatedHeader style={{ transform: [{ translateY: viewTranslation }] }}>
              <AnimatedHighlightThematicHomeHeader
                {...thematicHeader}
                gradientTranslation={gradientTranslation}
                imageAnimatedHeight={imageAnimatedHeight}
              />
            </AnimatedHeader>
          )}
        </React.Fragment>
      )}
    </Container>
  )
}

const AnimatedHeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

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
