import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import AnimatedLottieView from 'lottie-react-native'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { Alert } from 'react-native'
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
  endFrame?: number
  title: string
  subTitle: string
  text: string
}

export const GenericTutorial: FunctionComponent<Props> = (props) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    if (props.endFrame) {
      animationRef.current?.play(0, 62)
    }
  }, [])

  function goToHomeWithoutModal() {
    navigate('TabNavigator')
  }

  function goToNextTutorial() {
    Alert.alert('TODO: PC-5960')
  }

  return (
    <Container>
      <Spacer.Flex flex={1} />
      <Container2>
        <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={goToHomeWithoutModal} />
      </Container2>
      <Spacer.Flex flex={2} />
      <StyledLottieView
        ref={animationRef}
        source={props.animation}
        autoPlay
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
        <ButtonPrimary title={_(t`Continuer`)} onPress={goToNextTutorial} />
      </ButtonContainer>
      <Spacer.Flex flex={0.5} />
      <StepDots numberOfSteps={4} currentStep={1} />
      <Spacer.Flex flex={1} />
    </Container>
  )
}

const Container2 = styled.View({
  alignSelf: 'flex-end',
  width: '40%',
})

const ButtonContainer = styled.View({
  paddingHorizontal: getSpacing(6),
  width: '100%',
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
