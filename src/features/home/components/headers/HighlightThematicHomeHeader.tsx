import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { Introduction } from 'features/home/components/headers/highlightThematic/Introduction'
import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { HighlightThematicHeader } from 'features/home/types'
import { Tag } from 'ui/components/Tag/Tag'
import { TagVariant } from 'ui/components/Tag/types'
import { getSpacing, Typo } from 'ui/theme'
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
          <Tag label={dateRange} variant={TagVariant.DEFAULT} />
        </DateRangeCaptionContainer>
        <TextContainer>
          <BlackGradient height={HEADER_BLACK_BACKGROUND_HEIGHT} />
          <BlackBackground>
            {subtitle ? <Subtitle numberOfLines={1}>{subtitle}</Subtitle> : null}
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
    position: 'absolute',
    zIndex: theme.zIndex.header,
    top: statusBarHeight + getSpacing(6),
    right: getSpacing(6),
  })
)

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  marginBottom: getSpacing(1),
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
