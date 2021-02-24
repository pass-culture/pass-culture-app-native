import { t } from '@lingui/macro'
import AnimatedLottieView from 'lottie-react-native'
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
import { Axis, getGrid } from 'ui/theme/grid'

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

  if (props.index === undefined || props.lastIndex === undefined) {
    throw new MonitoringError(
      `You must use GenericAchievementCard as a children of GenericAchievement.
 
      You may be missing the following props in your card component:

        swiperRef={props.swiperRef}
        name={props.name}
        index={props.index}
        activeIndex={props.activeIndex}
        lastIndex={props.lastIndex}
        
Those props are provided by the GenericAchievementCard and must be passed down to the GenericAchievementCard from within your custom Card component!`
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
      <Spacer.Flex flex={getGrid({ sm: 1, default: 2 }, Axis.HEIGHT)} />
      <StyledLottieContainer>
        <StyledLottieView
          key={props.activeIndex}
          ref={animationRef}
          source={props.animation}
          loop={false}
        />
      </StyledLottieContainer>
      <Spacer.Flex flex={1} />
      <StyledTitle>{props.title}</StyledTitle>
      <StyledSubTitle>{props.subTitle}</StyledSubTitle>
      <Spacer.Flex flex={0.5} />
      <StyledBody>{props.text}</StyledBody>
      <Spacer.Flex flex={2} />
      <BottomButtonsContainer>
        <Animatable.View ref={animatedButtonRef}>
          {props.activeIndex === props.index ? (
            <ButtonPrimary title={props.buttonText} onPress={props.buttonCallback} />
          ) : (
            <InvisibleButtonHeight testID="invisible-button-height" />
          )}
        </Animatable.View>
        {!props.lastIndex && (
          <FlexContainer>
            <ButtonPrimaryWhite title={_(t`Passer`)} onPress={props.skip} />
          </FlexContainer>
        )}
      </BottomButtonsContainer>
      <Spacer.Flex flex={!props.lastIndex ? 2 : getGrid({ default: 0, sm: 0.25 }, Axis.HEIGHT)} />
    </GenericCardContainer>
  )
}

const FlexContainer = styled.View({
  flexGrow: 1,
  marginTop: getSpacing(getGrid({ default: 4, sm: 2 }, Axis.HEIGHT)),
})

const BottomButtonsContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
})

const InvisibleButtonHeight = styled.View({
  height: getSpacing(12),
})

const StyledLottieContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  height: '30%',
})

const GenericCardContainer = styled.View({
  flex: 1,
  paddingHorizontal: getSpacing(5),
})

const StyledLottieView = styled(AnimatedLottieView)({
  flexGrow: 1,
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
