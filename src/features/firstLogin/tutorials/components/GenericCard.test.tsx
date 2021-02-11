import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { analytics } from 'libs/analytics'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'

import { CardProps, didFadeIn, GenericCard } from './GenericCard'

describe('<GenericCard />', () => {
  const animation = GeolocationAnimation
  const buttonCallback = jest.fn()
  const buttonText = 'Submit'
  const pauseAnimationOnRenderAtFrame = 62
  const subTitle = 'Subtitle'
  const text = 'Text'
  const title = 'Title'
  const play = jest.fn()
  const pause = jest.fn()
  beforeEach(jest.resetAllMocks)

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

  it('should call card analytics on active index', () => {
    const { getByTestId } = render(
      <GenericTutorial name="TestTutorial">
        <GenericCard
          buttonText={buttonText}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
        />
        <GenericCard
          buttonText={buttonText}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
        />
      </GenericTutorial>
    )
    expect(analytics.logScreenView).toHaveBeenCalledWith('TestTutorial1')
    expect(analytics.logScreenView).toBeCalledTimes(1)
    fireEvent.press(getByTestId('controlButton'))
    expect(analytics.logScreenView).toHaveBeenCalledWith('TestTutorial2')
    expect(analytics.logScreenView).toBeCalledTimes(2)
  })

  it('should have a button available on active index', () => {
    const { getByTestId, queryByText } = render(
      <GenericTutorial name="TestTutorial">
        <GenericCard
          buttonText={'button1'}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
        />
        <GenericCard
          buttonText={'button2'}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
        />
      </GenericTutorial>
    )
    expect(queryByText('button1')).toBeTruthy()
    expect(queryByText('button2')).toBeFalsy()
    fireEvent.press(getByTestId('controlButton'))
    expect(queryByText('button2')).toBeTruthy()
    expect(queryByText('button1')).toBeFalsy()
  })

  it('should not have a button when not active index', () => {
    const { getByTestId, queryByText } = render(
      <GenericCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={2}
        activeIndex={1}
      />
    )
    expect(queryByText(buttonText)).toBeFalsy()
    expect(getByTestId('invisible-button-height')).toBeTruthy()
  })

  it('should have a button and no invisible-button-height when active index', () => {
    const { queryByTestId, getByText } = render(
      <GenericCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={1}
        activeIndex={1}
      />
    )
    expect(getByText(buttonText)).toBeTruthy()
    expect(queryByTestId('invisible-button-height')).toBeFalsy()
  })

  it('should pause animation when not on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    renderGenericCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 0,
      index: 1,
    })
    await waitForExpect(() => {
      expect(play).not.toBeCalled()
      expect(pause).toBeCalledTimes(1)
    })
  })

  it('should play animation when on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    renderGenericCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 1,
      index: 1,
    })
    await waitForExpect(() => {
      expect(play).toBeCalledTimes(1)
      expect(play).toBeCalledWith(0, pauseAnimationOnRenderAtFrame)
      expect(pause).not.toBeCalled()
    })
  })

  it('should not fade in button when not on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    renderGenericCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 0,
      index: 1,
    })
    await waitForExpect(() => {
      expect(didFadeIn).not.toBe(true)
    })
  })

  it('should fade in button when on active index', async () => {
    const fadeIn = jest.fn()
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        fadeIn,
      },
    })
    renderGenericCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 1,
      index: 1,
    })
    await waitForExpect(() => {
      expect(didFadeIn).toBe(true)
    })
  })
})

function renderGenericCardComponent(props: CardProps) {
  return render(<GenericCard {...props} />)
}
