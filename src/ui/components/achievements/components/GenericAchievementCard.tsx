import { t } from '@lingui/macro'
import AnimatedLottieView from 'lottie-react-native'
import LottieView from 'lottie-react-native'
import React, { FunctionComponent, RefObject, useEffect } from 'react'
import { View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Swiper from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { MonitoringError } from 'libs/errorMonitoring'
import { _ } from 'libs/i18n'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing, Typo } from 'ui/theme'

export type AchievementCardKeyProps = {
  activeIndex?: number
  index?: number
  key?: number
  name?: string
  swiperRef?: RefObject<Swiper>
  lastIndex?: number
  skip?: () => void
}

export type AchievementCardProps = AchievementCardKeyProps & {
  animation: AnimationObject
  buttonCallback?: () => void
  buttonText: string
  pauseAnimationOnRenderAtFrame: number
  subTitle: string
  text: string
  title: string
}

export let didFadeIn = false

export const GenericAchievementCard: FunctionComponent<AchievementCardProps> = (
  props: AchievementCardProps
) => {
  const animationRef = React.useRef<AnimatedLottieView>(null)
  const animatedButtonRef = React.useRef<Animatable.View & View>(null)

  if (props.index === undefined) {
    throw new MonitoringError(
      'You must use GenericAchievementCard as a children of GenericAchievement'
    )
  }

  didFadeIn = false
  useEffect(() => {
    if (props.index === props.activeIndex) {
      animationRef.current?.play(0, props.pauseAnimationOnRenderAtFrame)
    } else {
      animationRef.current?.pause()
    }
  }, [props.pauseAnimationOnRenderAtFrame, animationRef, props.index, props.activeIndex])

  useEffect(() => {
    const button = animatedButtonRef?.current
    if (button?.fadeIn) {
      if (props.index === props.activeIndex) {
        button.fadeIn(1000)
        didFadeIn = true
      }
    }
  }, [animatedButtonRef])

  useEffect(() => {
    if (props.name && props.index !== undefined && props.activeIndex === props.index) {
      analytics.logScreenView(props.name)
    }
  }, [props.name, props.index, props.activeIndex])

  return (
    <GenericCardContainer>
      <Spacer.Flex flex={2} />
      <StyledLottieContainer>
        <StyledLottieView
          key={props.activeIndex}
          ref={animationRef}
          source={props.animation}
          loop={false}
          resizeMode="contain"
        />
      </StyledLottieContainer>
      <Spacer.Flex flex={1} />
      <StyledTitle>{props.title}</StyledTitle>
      <StyledSubTitle>{props.subTitle}</StyledSubTitle>
      <Spacer.Flex flex={1} />
      <StyledBody>{props.text}</StyledBody>
      <Spacer.Flex flex={2} />
      <Animatable.View ref={animatedButtonRef}>
        {props.activeIndex === props.index ? (
          <ButtonPrimary title={props.buttonText} onPress={props.buttonCallback} />
        ) : (
          <InvisibleButtonHeight testID="invisible-button-height" />
        )}
      </Animatable.View>
      {!props.lastIndex ? (
        <React.Fragment>
          <Spacer.Flex flex={1} />
          <ButtonPrimaryWhite title={_(t`Passer`)} onPress={props.skip} />
        </React.Fragment>
      ) : (
        <Spacer.Flex flex={3} />
      )}
    </GenericCardContainer>
  )
}

const InvisibleButtonHeight = styled.View({
  height: getSpacing(12),
})

const StyledLottieContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
})

const GenericCardContainer = styled.View({
  flex: 1,
  paddingHorizontal: getSpacing(5),
})

const StyledLottieView = styled(LottieView)({
  width: getSpacing(60),
  height: getSpacing(60),
})

const StyledTitle = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledSubTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
