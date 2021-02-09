import { renderHook } from '@testing-library/react-hooks'
import { fireEvent, render } from '@testing-library/react-native'
import AnimatedLottieView from 'lottie-react-native'
import React, { RefObject } from 'react'
import { View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import { analytics } from 'libs/analytics'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'

import {
  CardProps,
  GenericCard,
  useAnalyticsLogScreenView,
  useButtonAnimation,
  usePlayAnimation,
} from './GenericCard'

describe('<GenericCard />', () => {
  const animation = GeolocationAnimation
  const buttonCallback = jest.fn()
  const buttonText = 'Submit'
  const pauseAnimationOnRenderAtFrame = 62
  const subTitle = 'Subtitle'
  const text = 'Text'
  const title = 'Title'
  it('should render correctly', () => {
    const { getByText } = renderGenericCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
    })
    expect(getByText(title)).toBeTruthy()
    expect(getByText(subTitle)).toBeTruthy()
    expect(getByText(text)).toBeTruthy()
    const button = getByText(buttonText)
    expect(button).toBeTruthy()
    fireEvent.press(button)
    expect(buttonCallback).toHaveBeenCalled()
  })
  it('should play animation', () => {
    const ref = {
      current: {
        play: jest.fn(),
      },
    }
    renderHook(() =>
      usePlayAnimation(
        (ref as unknown) as RefObject<AnimatedLottieView>,
        pauseAnimationOnRenderAtFrame
      )
    )
    expect(ref.current.play).toHaveBeenCalledTimes(1)
  })
  it('should animate button with fadeIn when activeIndex is index', () => {
    const ref = {
      current: {
        fadeIn: jest.fn(),
        fadeOut: jest.fn(),
      },
    }
    const index = 0
    const activeIndex = index
    renderHook(() =>
      useButtonAnimation((ref as unknown) as RefObject<Animatable.View & View>, index, activeIndex)
    )
    expect(ref.current.fadeIn).toHaveBeenCalledTimes(1)
    expect(ref.current.fadeOut).toHaveBeenCalledTimes(0)
  })
  it('should animate button with fadeOut when activeIndex is not index', () => {
    const ref = {
      current: {
        fadeIn: jest.fn(),
        fadeOut: jest.fn(),
      },
    }
    const index = 0
    const activeIndex = 1
    renderHook(() =>
      useButtonAnimation((ref as unknown) as RefObject<Animatable.View & View>, index, activeIndex)
    )
    expect(ref.current.fadeIn).toHaveBeenCalledTimes(0)
    expect(ref.current.fadeOut).toHaveBeenCalledTimes(1)
  })
  it('should not log screen view when activeIndex is not index', async () => {
    const index = 0
    const activeIndex = 1
    const tutorialName = 'TestTutorial'
    const props: CardProps = {
      index,
      activeIndex,
      name: `${tutorialName}${index + 1}`,
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
    }
    renderHook(() => useAnalyticsLogScreenView(props))
    expect(analytics.logScreenView).not.toHaveBeenCalledWith(props.name)
    expect(analytics.logScreenView).not.toHaveBeenCalledTimes(1)
  })
  it('should log screen view when activeIndex is index', async () => {
    const index = 0
    const activeIndex = index
    const tutorialName = 'TestTutorial'
    const props: CardProps = {
      index,
      activeIndex,
      name: `${tutorialName}${index + 1}`,
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
    }
    renderHook(() => useAnalyticsLogScreenView(props))
    expect(analytics.logScreenView).toHaveBeenCalledWith(props.name)
    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
  })
})

function renderGenericCardComponent(props: CardProps) {
  return render(<GenericCard {...props} />)
}
