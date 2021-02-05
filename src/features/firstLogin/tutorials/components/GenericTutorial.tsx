import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import AnimatedLottieView from 'lottie-react-native'
import React, { ComponentProps, FunctionComponent, useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { StepDots } from 'ui/components/StepDots'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { Swiper } from './Swiper'

type Props = {
  animation: AnimationObject
  buttonCallback: () => void
  buttonText: string
  pauseAnimationOnRenderAtFrame?: number
  step: number
  subTitle: string
  text: string
  title: string
  onSwipeLeft?: ComponentProps<typeof Swiper>['onSwipeLeft']
  onSwipeRight?: ComponentProps<typeof Swiper>['onSwipeRight']
}

export const GenericTutorial: FunctionComponent<Props> = (props: Props) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    if (props.pauseAnimationOnRenderAtFrame) {
      animationRef.current?.play(0, props.pauseAnimationOnRenderAtFrame)
    }
  }, [props.pauseAnimationOnRenderAtFrame])

  function goToHomeWithoutModal() {
    navigate('TabNavigator')
  }

  return (
    <React.Fragment>
      <Background />
      <Spacer.TopScreen />
      <EntireScreen>
        <ScreenUsableArea>
          <SkipButton>
            <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={goToHomeWithoutModal} />
          </SkipButton>
          <TopSwiper onSwipeLeft={props.onSwipeLeft} onSwipeRight={props.onSwipeRight}>
            <Spacer.Flex flex={2} />
            <StyledLottieView
              ref={animationRef}
              source={props.animation}
              loop={false}
              size={getSpacing(60)}
            />
            <Spacer.Flex flex={1} />
            <StyledTitle>{props.title}</StyledTitle>
            <StyledSubTitle>{props.subTitle}</StyledSubTitle>
            <Spacer.Flex flex={1} />
            <StyledBody>{props.text}</StyledBody>
            <Spacer.Flex flex={2} />
          </TopSwiper>
          <ButtonPrimary title={props.buttonText} onPress={props.buttonCallback} />
          <BottomSwiper onSwipeLeft={props.onSwipeLeft} onSwipeRight={props.onSwipeRight}>
            <Spacer.Column numberOfSpaces={getSpacing(2)} />
            <StepDots numberOfSteps={4} currentStep={props.step} />
            <Spacer.Column numberOfSpaces={getSpacing(2)} />
          </BottomSwiper>
        </ScreenUsableArea>
        <Spacer.BottomScreen />
      </EntireScreen>
    </React.Fragment>
  )
}

const EntireScreen = styled.View({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorsEnum.WHITE,
  flexGrow: 1,
})

const ScreenUsableArea = styled.View({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  width: '100%',
  paddingTop: getSpacing(5),
  paddingHorizontal: getSpacing(5),
  maxWidth: getSpacing(125),
  maxHeight: getSpacing(225),
})

const SkipButton = styled.View({
  alignSelf: 'flex-end',
})

const TopSwiper = styled(Swiper)({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  width: '100%',
})

const BottomSwiper = styled(Swiper)({
  alignItems: 'center',
  width: '100%',
})

const StyledLottieView = styled(LottieView)((props: { size: number }) => ({
  width: props.size,
  height: props.size,
}))

const StyledTitle = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledSubTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
