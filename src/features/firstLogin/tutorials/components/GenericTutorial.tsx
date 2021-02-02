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

export const GenericTutorial: FunctionComponent<Props> = (props) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    if (props.pauseAnimationOnRenderAtFrame) {
      animationRef.current?.play(0, props.pauseAnimationOnRenderAtFrame)
    }
  }, [])

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
      <StyledLottieView
        ref={animationRef}
        source={props.animation}
        loop={false}
        size={props.animationSize}
      />
      <Spacer.Flex flex={0.8} />
      <StyledTitle>{props.title}</StyledTitle>
      <StyledSubTitle>{props.subTitle}</StyledSubTitle>
      <Spacer.Flex flex={0.8} />
      <StyledBody>{props.text}</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary title={props.buttonText} onPress={props.buttonCallback} />
      </ButtonContainer>
      <Spacer.Flex flex={0.8} />
      <StepDots numberOfSteps={4} currentStep={props.step} />
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
