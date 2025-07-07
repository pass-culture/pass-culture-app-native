import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { theme } from 'theme'
import { ColorsType } from 'theme/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { HomeGradient } from 'ui/svg/HomeGradient'
import { getSpacing, Typo } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

const HEADER_HEIGHT = getSpacing(45)

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

type AppHeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppHeader: FunctionComponent<AppHeaderProps> = ({ title, subtitle, color }) => {
  const { width } = useWindowDimensions()

  const alpha = 0.5
  const gradientWithAlpha = gradientImagesMapping[color].map((color: ColorsType) =>
    colorAlpha(color, alpha)
  )

  return (
    <Container testID="CategoryThematicHomeHeaderV2">
      {Platform.OS === 'android' ? (
        <Gradient colors={gradientWithAlpha} />
      ) : (
        <HomeGradient
          colors={gradientImagesMapping[color]}
          testID="HomeGradient"
          width={Math.min(width, theme.breakpoints.lg)}
        />
      )}
      <TextContainer>
        <Background>
          <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
          {subtitle ? (
            <ViewGap gap={1}>
              <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
            </ViewGap>
          ) : null}
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

const Gradient = styled(LinearGradient).attrs(() => ({
  locations: [0, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
})

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
  color: theme.designSystem.color.text.lockedInverted,
  marginBottom: getSpacing(1),
}))

const Background = styled(BlackBackground)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
}))
