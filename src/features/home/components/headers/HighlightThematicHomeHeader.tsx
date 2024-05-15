import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { Introduction } from 'features/home/components/headers/highlightThematic/Introduction'
import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { HighlightThematicHeader } from 'features/home/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type HighligthThematicHeaderProps = Omit<HighlightThematicHeader, 'type'>

const DESKTOP_HEADER_HEIGHT = getSpacing(100)
const MOBILE_HEADER_HEIGHT = getSpacing(70)

export const HighlightThematicHomeHeader: FunctionComponent<HighligthThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  introductionTitle,
  introductionParagraph,
}) => {
  const { top } = useCustomSafeInsets()

  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  const shouldShowIntroduction = !!introductionTitle && !!introductionParagraph

  return (
    <React.Fragment>
      <ImageBackground source={{ uri: imageUrl }}>
        <DateRangeCaptionContainer statusBarHeight={top}>
          <DateRangeCaption>{dateRange}</DateRangeCaption>
        </DateRangeCaptionContainer>
        <TextContainer>
          <BlackGradient height={HEADER_BLACK_BACKGROUND_HEIGHT} />
          <BlackBackground>
            {subtitle ? (
              <React.Fragment>
                <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
                <Spacer.Column numberOfSpaces={1} />
              </React.Fragment>
            ) : null}
            <Title numberOfLines={2}>{title}</Title>
          </BlackBackground>
        </TextContainer>
      </ImageBackground>
      {shouldShowIntroduction ? (
        <Introduction title={introductionTitle} paragraph={introductionParagraph} />
      ) : null}
    </React.Fragment>
  )
}

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  height: theme.isDesktopViewport ? DESKTOP_HEADER_HEIGHT : MOBILE_HEADER_HEIGHT,
  marginBottom: getSpacing(6),
}))

const DateRangeCaptionContainer = styled.View<{ statusBarHeight: number }>(
  ({ theme, statusBarHeight }) => ({
    backgroundColor: theme.colors.black,
    position: 'absolute',
    top: statusBarHeight + getSpacing(6),
    right: getSpacing(6),
    borderRadius: getSpacing(2),
    paddingVertical: getSpacing(1),
    paddingHorizontal: getSpacing(2),
  })
)

const DateRangeCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))
