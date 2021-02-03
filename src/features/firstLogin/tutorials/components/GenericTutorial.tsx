import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import AnimatedLottieView from 'lottie-react-native'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { StepDots } from 'ui/components/StepDots'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  currentStep?: number
  animation: AnimationObject
  animationSize: number
  buttonCallback: () => void
  buttonText: string
  pauseAnimationOnRenderAtFrame?: number
  step: number
  subTitle: string
  text: string
  title: string
}

export const GenericTutorial: FunctionComponent<Props> = ({
  currentStep = 1,
  animation,
  animationSize,
  title,
  subTitle,
  text,
  pauseAnimationOnRenderAtFrame,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    if (pauseAnimationOnRenderAtFrame) {
      animationRef.current?.play(0, pauseAnimationOnRenderAtFrame)
    }
  }, [pauseAnimationOnRenderAtFrame])

  function goToHomeWithoutModal() {
    navigate('TabNavigator')
  }

  return (
    <Container>
      <Spacer.Flex flex={1} />
      <Header>
        <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={goToHomeWithoutModal} />
      </Header>
      <Spacer.Flex flex={2} />
      <StyledLottieView ref={animationRef} source={animation} loop={false} size={animationSize} />
      <Spacer.Flex flex={0.8} />
      <StyledTitle>{title}</StyledTitle>
      <StyledSubTitle>{subTitle}</StyledSubTitle>
      <Spacer.Flex flex={0.8} />
      <StyledBody>{text}</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary title={props.buttonText} onPress={props.buttonCallback} />
      </ButtonContainer>
      <StepDots numberOfSteps={4} currentStep={currentStep} />
      <Spacer.Flex flex={1} />
    </Container>
  )
}

const Header = styled.View({
  alignSelf: 'flex-end',
  width: '40%',
})

const ButtonContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
  paddingHorizontal: getSpacing(6),
  justifyContent: 'center',
  marginBottom: getSpacing(8),
})

const StyledLottieView = styled(LottieView)((props: { size: number }) => ({
  width: props.size,
  height: props.size,
}))

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.BLACK,
})({
  width: '60%',
  textAlign: 'center',
  flexDirection: 'column',
})

const Container = styled.View({
  alignItems: 'center',
  flexGrow: 1,
})

const StyledTitle = styled(Typo.Title1).attrs({
  color: ColorsEnum.BLACK,
})({
  display: 'flex',
})

const StyledSubTitle = styled(Typo.Title2).attrs({
  color: ColorsEnum.BLACK,
})({
  textAlign: 'center',
})
