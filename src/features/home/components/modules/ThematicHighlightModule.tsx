import colorAlpha from 'color-alpha'
import { isBefore } from 'date-fns'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { MarketingBlockHighlight } from 'features/home/components/modules/marketing/MarketingBlockHighlight'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'

const TILE_HEIGHT = 244

type Props = {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  toThematicHomeEntryId: string
  index: number
  homeEntryId: string
}

export const ThematicHighlightModule: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  toThematicHomeEntryId,
  index,
  homeEntryId,
}) => {
  const isAlreadyEnded = isBefore(endingDate, new Date())
  const shouldHideModule = isAlreadyEnded

  const isNewHighlightModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_NEW_HIGHLIGHT_THEMATIC_MODULE
  )
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: isNewHighlightModule,
    homeId: homeEntryId ?? '',
  })

  useEffect(() => {
    !shouldHideModule &&
      analytics.logModuleDisplayedOnHomepage({
        moduleId: id,
        moduleType: ContentTypes.THEMATIC_HIGHLIGHT,
        index,
        homeEntryId,
      })
    // should send analytics event only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (shouldHideModule) return null

  const navigateTo = {
    screen: 'ThematicHome',
    params: { homeId: toThematicHomeEntryId, from: 'highlight_thematic_block', moduleId: id },
  }
  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  const sendAnalyticsOnPress = () =>
    analytics.logHighlightBlockClicked({
      moduleId: id,
      entryId: homeEntryId,
      toEntryId: toThematicHomeEntryId,
    })

  return (
    <React.Fragment>
      {hasGraphicRedesign ? (
        <Container testID="new-highlight-module-container">
          <MarketingBlockHighlight
            homeId={toThematicHomeEntryId}
            backgroundImageUrl={imageUrl}
            moduleId={id}
            title={title}
            subtitle={dateRange}
            label={subtitle}
          />
        </Container>
      ) : (
        <StyledInternalTouchableLink
          navigateTo={navigateTo}
          onBeforeNavigate={sendAnalyticsOnPress}>
          <ImageBackground source={{ uri: imageUrl }}>
            <DateRangeCaptionContainer>
              <DateRangeCaption>{dateRange}</DateRangeCaption>
            </DateRangeCaptionContainer>
            <TextContainer>
              <BlackGradient />
              <BlackBackground>
                {subtitle ? (
                  <React.Fragment>
                    <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
                    <Spacer.Column numberOfSpaces={1} />
                  </React.Fragment>
                ) : null}
                <TitleContainer>
                  <Title numberOfLines={1}>{title}</Title>
                  <IconContainer>
                    <PlainArrowNext size={theme.icons.sizes.standard} color={theme.colors.white} />
                  </IconContainer>
                </TitleContainer>
              </BlackBackground>
            </TextContainer>
          </ImageBackground>
        </StyledInternalTouchableLink>
      )}
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.home.spaceBetweenModules,
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))(({ theme }) => ({
  height: TILE_HEIGHT,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.home.spaceBetweenModules,
}))

const ImageBackground = styled.ImageBackground({
  height: '100%',
  overflow: 'hidden',
  borderRadius: getSpacing(2),
})

const DateRangeCaptionContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: theme.colors.black,
  borderTopRightRadius: getSpacing(2),
  borderBottomLeftRadius: getSpacing(2),
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(2),
}))

const DateRangeCaption = styled(Typo.Hint)(({ theme }) => ({
  color: theme.colors.white,
}))

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
}))

const Title = styled(TypoDS.Title3)(({ theme }) => ({
  color: theme.colors.white,
  flexShrink: 1,
}))

const Subtitle = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const IconContainer = styled.View({
  flexShrink: 0,
  marginLeft: getSpacing(2),
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
