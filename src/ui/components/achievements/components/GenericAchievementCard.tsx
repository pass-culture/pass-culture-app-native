import { t } from '@lingui/macro'
import React, { FunctionComponent, RefObject, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Swiper from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import LottieView from 'libs/lottie'
import { MonitoringError } from 'libs/monitoring'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

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
  centerChild?: (() => JSX.Element) | null
  text: string
  title: string
}

const SMALL_HEIGHT = 576
export let didFadeIn = false

// TODO(anoukhello): refactor this page with GenericInfoPageWhite component
export const GenericAchievementCard: FunctionComponent<AchievementCardProps> = (
  props: AchievementCardProps
) => {
  const grid = useGrid()
  const animationRef = React.useRef<LottieView>(null)
  const animatedButtonRef = React.useRef<Animatable.View & View>(null)

  const isSmallHeight = useMediaQuery({ maxHeight: SMALL_HEIGHT })
  const lottieStyle = useMemo(
    () => (isSmallHeight ? { height: '100%' } : undefined),
    [isSmallHeight]
  )

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
    const lottieAnimation = animationRef.current
    if (!lottieAnimation) return
    if (props.index === props.activeIndex) {
      lottieAnimation.play(0, props.pauseAnimationOnRenderAtFrame)
    } else {
      // !!! : pause() does not exit on lottie-react-native web API and the typing is not showing it.
      // Even without pause(), the animation still behave as expected on the web.
      if (lottieAnimation.pause) {
        lottieAnimation.pause()
      }
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
      <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
      <StyledLottieContainer>
        <StyledLottieView
          style={lottieStyle}
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
      {!!props.centerChild && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <props.centerChild />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      )}
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
          <FlexContainer marginTop={getSpacing(grid({ default: 4, sm: 2 }, 'height'))}>
            <ButtonPrimaryWhite title={t`Passer`} onPress={props.skip} />
          </FlexContainer>
        )}
      </BottomButtonsContainer>
    </GenericCardContainer>
  )
}

const FlexContainer = styled.View<{ marginTop: number }>((props) => ({
  flexGrow: 1,
  marginTop: props.marginTop,
}))

const BottomButtonsContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  paddingBottom: getSpacing(10),
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

const StyledLottieView = styled(LottieView)({
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
