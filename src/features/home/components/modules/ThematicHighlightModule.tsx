import colorAlpha from 'color-alpha'
import { isBefore } from 'date-fns'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { computeDateRangeDisplay } from 'features/home/components/modules/helpers/computeDateRangeDisplay'
import { getNavigateToThematicHomeConfig } from 'features/navigation/helpers/getNavigateToThematicHomeConfig'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const TILE_HEIGHT = 244

type Props = {
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  thematicHomeEntryId: string
}

export const ThematicHighlightModule: FunctionComponent<Props> = ({
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  thematicHomeEntryId,
}) => {
  const isAlreadyEnded = isBefore(endingDate, new Date())
  if (isAlreadyEnded) return null

  const navigateTo = getNavigateToThematicHomeConfig(thematicHomeEntryId)
  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  return (
    <StyledInternalTouchableLink navigateTo={navigateTo}>
      <ImageBackground source={{ uri: imageUrl }}>
        <DateRangeCaptionContainer>
          <DateRangeCaption>{dateRange}</DateRangeCaption>
        </DateRangeCaptionContainer>
        <TextContainer>
          {!!subtitle && (
            <React.Fragment>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          )}
          <Title numberOfLines={1}>{title}</Title>
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
  marginBottom: getSpacing(6),
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

const TextContainer = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.colors.black, 0), colorAlpha(theme.colors.black, 0.92)],
}))({
  position: 'absolute',
  bottom: 0,
  paddingTop: getSpacing(8),
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(4),
})

const Title = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
}))

const Subtitle = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
