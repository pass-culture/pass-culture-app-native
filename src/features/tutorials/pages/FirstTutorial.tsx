import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import AnimatedLottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { Spacer } from 'ui/components/spacer/Spacer'
import { StepDots } from 'ui/components/StepDots'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export function FirstTutorial() {
  const { navigate } = useNavigation<UseNavigationType>()

  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    animationRef.current?.play(0, 62)
  }, [])

  function goToHomeWithoutModal() {
    navigate('Home', { shouldDisplayLoginModal: false })
  }

  function goToNextTutorial() {
    navigate('Home', { shouldDisplayLoginModal: false })
  }

  return (
    <React.Fragment>
      <Container2>
        <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={goToHomeWithoutModal} />
      </Container2>
      <Container>
        <React.Fragment>
          <StyledLottieView
            ref={animationRef}
            source={TutorialPassLogo}
            autoPlay
            loop={false}
            size={getSpacing(60)}
          />
          <Spacer.Column numberOfSpaces={9} />
        </React.Fragment>
        <StyledTitle>{_(t`Le pass Culture`)}</StyledTitle>
        <StyledSubTitle>{_(t`c'est...`)}</StyledSubTitle>
        <Spacer.Column numberOfSpaces={10} />
        <StyledBody>
          <Spacer.Flex />
          {_(t`une initiative financée par le Ministère de la Culture.`)}
          <Spacer.Flex />
        </StyledBody>
        <Spacer.Column numberOfSpaces={15} />
        <ButtonPrimary title={_(t`Continuer`)} onPress={goToNextTutorial} />
        <Spacer.Column numberOfSpaces={6} />
        <StepDots numberOfSteps={4} currentStep={1} />
      </Container>
    </React.Fragment>
  )
}

const Container2 = styled.View({
  paddingTop: getSpacing(6),
  alignSelf: 'flex-end',
  width: '40%',
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
  padding: getSpacing(6),
  alignItems: 'center',
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
