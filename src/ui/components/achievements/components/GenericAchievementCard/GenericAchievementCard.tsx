import React, { FunctionComponent, RefObject, useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import Swiper from 'react-native-web-swiper'
import styled, { useTheme } from 'styled-components/native'

import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'
import LottieView from 'libs/lottie'
import { MonitoringError } from 'libs/monitoring'
import { AnimatedView } from 'libs/react-native-animatable'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { AnimationObject } from 'ui/animations/type'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
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
  buttonAccessibilityLabel?: string
  pauseAnimationOnRenderAtFrame: number
  subTitle: string
  centerChild?: (() => JSX.Element) | null
  text: string
  title: string
  ignoreBottomPadding?: boolean
}

const SMALL_HEIGHT = 576
export let didFadeIn = false

// TODO(anoukhello): refactor this page with GenericInfoPageWhite component
export const GenericAchievementCard: FunctionComponent<AchievementCardProps> = (
  props: AchievementCardProps
) => {
  const { isSmallScreen } = useTheme()
  const grid = useGrid()
  const animationRef = React.useRef<LottieView>(null)
  const animatedButtonRef = React.useRef<AnimatedView & View>(null)

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

  const playAnimation = useCallback(() => {
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
  }, [props.activeIndex, props.index, props.pauseAnimationOnRenderAtFrame])

  useAppStateChange(playAnimation, undefined)
  useEffect(playAnimation, [playAnimation])

  didFadeIn = false
  useEffect(() => {
    const button = animatedButtonRef?.current
    if (button?.fadeIn) {
      if (props.index === props.activeIndex) {
        button.fadeIn(1000)
        didFadeIn = true
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedButtonRef])

  useEffect(() => {
    if (props.name && props.index !== undefined && props.activeIndex === props.index) {
      analytics.logScreenView(props.name)
    }
  }, [props.name, props.index, props.activeIndex])

  return (
    <GenericCardContainer accessibilityHidden={props.activeIndex !== props.index}>
      <Spacer.Flex flex={grid({ sm: 1, default: 2 }, 'height')} />
      <StyledLottieContainer accessibilityHidden>
        <StyledLottieView
          style={lottieStyle}
          key={props.activeIndex}
          ref={animationRef}
          source={props.animation}
          loop={false}
        />
      </StyledLottieContainer>
      <Spacer.Flex flex={1} />
      <ContentContainer>
        <StyledTitle>{props.title + LINE_BREAK + props.subTitle}</StyledTitle>
        <Spacer.Column numberOfSpaces={4} />
        {!!props.centerChild && (
          <React.Fragment>
            <props.centerChild />
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
        )}
        <StyledBody>{props.text}</StyledBody>
      </ContentContainer>
      <Spacer.Flex flex={2} />
      <BottomButtonsContainer
        isSmallScreen={isSmallScreen}
        paddingBottom={getSpacing(
          props.ignoreBottomPadding ? grid({ default: 10, sm: 2, md: 5 }, 'height') : 10
        )}>
        <AnimatedView ref={animatedButtonRef}>
          {props.activeIndex === props.index ? (
            <ButtonPrimary
              wording={props.buttonText}
              accessibilityLabel={props.buttonAccessibilityLabel}
              onPress={props.buttonCallback}
            />
          ) : (
            <InvisibleButtonHeight testID="invisible-button-height" />
          )}
        </AnimatedView>
        {!props.lastIndex && (
          <FlexContainer marginTop={getSpacing(grid({ default: 4, sm: 2 }, 'height'))}>
            <ButtonPrimaryWhite wording="Passer" onPress={props.skip} />
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

const BottomButtonsContainer = styled.View<{ isSmallScreen: boolean; paddingBottom: number }>(
  ({ isSmallScreen, paddingBottom }) => ({
    flex: isSmallScreen ? '0 0 auto' : 1,
    justifyContent: 'flex-end',
    paddingBottom,
  })
)

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

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ContentContainer = styled.View({
  overflowY: 'auto',
})
