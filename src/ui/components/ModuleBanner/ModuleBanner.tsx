import React from 'react'
import styled from 'styled-components/native'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Typo } from 'ui/theme'

import { BACKGROUND_IMAGE_SOURCE } from './backgroundImageSource'

interface ModuleBannerProps {
  navigateTo: InternalNavigationProps['navigateTo']
  leftIcon: JSX.Element
  rightIcon?: JSX.Element
  title: string
  subTitle: string
  testID?: string
}

export function ModuleBanner(props: ModuleBannerProps) {
  return (
    <StyledTouchableLink navigateTo={props.navigateTo} testID={props.testID} highlight>
      <ImageContainer>
        <ImageBackground source={BACKGROUND_IMAGE_SOURCE} testID="module-background">
          <Container>
            <IconContainer>{props.leftIcon}</IconContainer>
            <TextContainer>
              <ButtonText testID="module-title">{props.title}</ButtonText>
              <Body>{props.subTitle}</Body>
            </TextContainer>
            <IconContainer>{props.rightIcon || <ArrowNextIcon />}</IconContainer>
          </Container>
        </ImageBackground>
      </ImageContainer>
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(TouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({})

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
}))

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  backgroundColor: theme.colors.primary,
}))

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 0.9,
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: getSpacing(1),
})

const IconContainer = styled.View({
  width: getSpacing(10),
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'left',
})

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
  marginRight: getSpacing(1),
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const ArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``
