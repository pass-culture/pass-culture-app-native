import React from 'react'
import { TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'

import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { getSpacing, Typo } from 'ui/theme'

import { BACKGROUND_IMAGE_SOURCE } from './backgroundImageSource'

interface ModuleBannerProps {
  onPress: () => void
  leftIcon: JSX.Element
  rightIcon?: JSX.Element
  title: string
  subTitle: string
  testID?: string
}

export function ModuleBanner(props: ModuleBannerProps) {
  return (
    <TouchableHighlight onPress={props.onPress} testID={props.testID}>
      <ImageContainer>
        <ImageBackground source={BACKGROUND_IMAGE_SOURCE} testID="module-background">
          <Container>
            <IconContainer>{props.leftIcon}</IconContainer>
            <TextContainer>
              <ButtonText testID="module-title">
                <TitleContainer>{props.title}</TitleContainer>
              </ButtonText>
              <Body>{props.subTitle}</Body>
            </TextContainer>
            <IconContainer>{props.rightIcon || <NextArrowIcon />}</IconContainer>
          </Container>
        </ImageBackground>
      </ImageContainer>
    </TouchableHighlight>
  )
}

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

const TitleContainer = styled.Text({
  marginRight: 5,
})

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
