import React from 'react'
import { TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'

import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
        <ImageBackground
          source={require('../../../assets/images/BannerRectangle.png')}
          testID="module-background">
          <Container>
            <IconContainer>{props.leftIcon}</IconContainer>
            <TextContainer>
              <Typo.ButtonText color={ColorsEnum.WHITE} testID="module-title">
                {props.title}
              </Typo.ButtonText>
              <Typo.Body color={ColorsEnum.WHITE}>{props.subTitle}</Typo.Body>
            </TextContainer>
            <IconContainer>{props.rightIcon || <NextArrowIcon />}</IconContainer>
          </Container>
        </ImageBackground>
      </ImageContainer>
    </TouchableHighlight>
  )
}

const ImageContainer = styled.View({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  overflow: 'hidden',
})

const ImageBackground = styled.ImageBackground({
  width: '100%',
  justifyContent: 'center',
})

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
