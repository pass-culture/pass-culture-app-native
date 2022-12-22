import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { computeDateRangeDisplay } from 'features/home/components/modules/helpers/computeDateRangeDisplay'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const TILE_HEIGHT = 244

type Props = {
  displayedTitle: string
  displayedSubtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  thematicHomeEntryId: string
}

export const ThematicHighlightModule: FunctionComponent<Props> = ({
  displayedTitle,
  displayedSubtitle,
  imageUrl,
  beginningDate,
  endingDate,
  thematicHomeEntryId,
}) => {
  const navigationConfig = getTabNavConfig('Home', {
    entryId: thematicHomeEntryId,
  })
  const navigateTo = {
    screen: navigationConfig[0],
    params: navigationConfig[1],
  }

  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)
  if (dateRange === null) return <React.Fragment></React.Fragment>

  return (
    <StyledInternalTouchableLink navigateTo={navigateTo}>
      <ImageBackground source={{ uri: imageUrl }}>
        <DateRangeCaptionContainer>
          <DateRangeCaption>{dateRange}</DateRangeCaption>
        </DateRangeCaptionContainer>
        <TextContainer>
          {!!displayedSubtitle && (
            <React.Fragment>
              <Subtitle numberOfLines={1}>{displayedSubtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          )}
          <Title numberOfLines={1}>{displayedTitle}</Title>
        </TextContainer>
      </ImageBackground>
    </StyledInternalTouchableLink>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))(({ theme }) => ({
  height: TILE_HEIGHT,
  marginLeft: theme.contentPage.marginHorizontal,
  marginRight: theme.contentPage.marginHorizontal,
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
  paddingTop: getSpacing(1),
  paddingLeft: getSpacing(2),
  paddingRight: getSpacing(2),
  paddingBottom: getSpacing(1),
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
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(4),
  paddingBottom: getSpacing(4),
})

const Title = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
}))

const Subtitle = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
