import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const HEADER_HEIGHT = getSpacing(52)

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
}) => {
  return (
    <React.Fragment>
      <ImageBackground source={{ uri: imageUrl }}>
        <TextContainer>
          <BlackGradient height={HEADER_BLACK_BACKGROUND_HEIGHT} />
          <BlackBackground>
            <TitleContainer>
              <Title numberOfLines={2}>{title}</Title>
              {!!subtitle && (
                <React.Fragment>
                  <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
                  <Spacer.Column numberOfSpaces={1} />
                </React.Fragment>
              )}
            </TitleContainer>
          </BlackBackground>
        </TextContainer>
      </ImageBackground>
    </React.Fragment>
  )
}

const ImageBackground = styled.ImageBackground({
  height: HEADER_HEIGHT,
  marginBottom: getSpacing(6),
})

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const TitleContainer = styled.View(({ theme }) => ({
  // The size of the title block should not exceed two lines of title and one of subtitle
  maxHeight:
    parseInt(theme.typography.title1.lineHeight) * 2 +
    getSpacing(1) +
    parseInt(theme.typography.title4.lineHeight),
  overflow: 'hidden',
}))
