import colorAlpha from 'color-alpha'
import { isBefore } from 'date-fns'
import React, { FunctionComponent, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { computeDateRangeDisplay } from 'features/home/components/modules/helpers/computeDateRangeDisplay'
import { getNavigateToThematicHomeConfig } from 'features/navigation/helpers/getNavigateToThematicHomeConfig'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const TILE_HEIGHT = 244
const TEXT_BACKGROUND_OPACITY = 0.67

type Props = {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  thematicHomeEntryId: string
  index: number
}

export const ThematicHighlightModule: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  thematicHomeEntryId,
  index,
}) => {
  const isAlreadyEnded = isBefore(endingDate, new Date())
  const shouldHideModule = isAlreadyEnded

  useEffect(() => {
    !shouldHideModule &&
      analytics.logModuleDisplayedOnHomepage(
        id,
        ContentTypes.THEMATIC_HIGHLIGHT,
        index,
        thematicHomeEntryId
      )
    // should send analytics event only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (shouldHideModule) return null

  const navigateTo = getNavigateToThematicHomeConfig(thematicHomeEntryId)
  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  return (
    <StyledInternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={analytics.logHighlightBlockClicked}>
      <ImageBackground source={{ uri: imageUrl }}>
        <DateRangeCaptionContainer>
          <DateRangeCaption>{dateRange}</DateRangeCaption>
        </DateRangeCaptionContainer>
        <TextContainer>
          <Gradient />
          <BlackBackground>
            {!!subtitle && (
              <React.Fragment>
                <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
                <Spacer.Column numberOfSpaces={1} />
              </React.Fragment>
            )}
            <Title numberOfLines={1}>{title}</Title>
          </BlackBackground>
        </TextContainer>
      </ImageBackground>
    </StyledInternalTouchableLink>
  )
}

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

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.black, 0),
    colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
  ],
}))({ height: getSpacing(8) })

const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
}))

const Title = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
}))

const Subtitle = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
