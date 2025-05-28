import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { getSpacing, Typo } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

const HEADER_HEIGHT = getSpacing(45)

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

type AppHeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppHeader: FunctionComponent<AppHeaderProps> = ({ title, subtitle, color }) => {
  return (
    <ImageBackground
      source={color ? gradientImagesMapping[color] : null}
      resizeMode="stretch"
      testID="CategoryThematicHomeHeaderV2">
      <TextContainer>
        <Background>
          <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
          {subtitle ? <Subtitle numberOfLines={2}>{subtitle}</Subtitle> : null}
        </Background>
      </TextContainer>
    </ImageBackground>
  )
}

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  color,
}) => {
  return <AppHeader title={title} subtitle={subtitle} color={color} />
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
  marginBottom: getSpacing(1),
}))

const Background = styled(BlackBackground)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0),
}))
