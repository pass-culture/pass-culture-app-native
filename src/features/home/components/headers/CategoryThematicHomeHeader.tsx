import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { theme } from 'theme'
import { HomeGradient } from 'ui/svg/HomeGradient'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

const HEADER_HEIGHT = getSpacing(45)

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

type AppHeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppHeader: FunctionComponent<AppHeaderProps> = ({ title, subtitle, color }) => {
  const { width } = useWindowDimensions()

  return (
    <Container testID="CategoryThematicHomeHeaderV2">
      <HomeGradient
        colors={gradientImagesMapping[color]}
        testID="HomeGradient"
        width={Math.min(width, theme.breakpoints.lg)}
      />
      <TextContainer>
        <Background>
          <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
          {subtitle ? <Subtitle numberOfLines={2}>{subtitle}</Subtitle> : null}
        </Background>
      </TextContainer>
    </Container>
  )
}

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  color,
}) => {
  return <AppHeader title={title} subtitle={subtitle} color={color} />
}

const Container = styled.View({
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
