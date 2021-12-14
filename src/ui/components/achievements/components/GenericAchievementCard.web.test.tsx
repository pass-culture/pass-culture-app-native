import React from 'react'
import waitForExpect from 'wait-for-expect'

import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'

import { GenericAchievement } from './GenericAchievement'
import { AchievementCardProps, didFadeIn, GenericAchievementCard } from './GenericAchievementCard'

describe('<GenericAchievementCard />', () => {
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
    const { getByText } = renderGenericAchievementCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 0,
      index: 0,
      lastIndex: 0,
    })
    expect(getByText(title)).toBeTruthy()
    expect(getByText(subTitle)).toBeTruthy()
    expect(getByText(text)).toBeTruthy()
    const button = getByText(buttonText)
    expect(button).toBeTruthy()
    fireEvent.click(button)
    expect(buttonCallback).toHaveBeenCalled()
  })

  it('should fail to render if not children of GenericAchievement', () => {
    const { getByText } = renderGenericAchievementCardComponent({
      buttonText,
      animation,
      buttonCallback,
      pauseAnimationOnRenderAtFrame,
      subTitle,
      text,
      title,
      activeIndex: 0,
      index: 0,
      lastIndex: 0,
    })
    expect(getByText(title)).toBeTruthy()
    expect(getByText(subTitle)).toBeTruthy()
    expect(getByText(text)).toBeTruthy()
    const button = getByText(buttonText)
    expect(button).toBeTruthy()
    fireEvent.click(button)
    expect(buttonCallback).toHaveBeenCalled()
  })

  it('should call card analytics on active index', () => {
    const { getByTestId } = render(
      <GenericAchievement screenName="FirstTutorial">
        <GenericAchievementCard
          buttonText={buttonText}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
          activeIndex={0}
          index={0}
          lastIndex={1}
        />
        <GenericAchievementCard
          buttonText={buttonText}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
          activeIndex={0}
          index={1}
          lastIndex={1}
        />
      </GenericAchievement>
    )
    expect(analytics.logScreenView).toHaveBeenCalledWith('FirstTutorial1')
    expect(analytics.logScreenView).toBeCalledTimes(1)
    fireEvent.click(getByTestId('controlButton'))
    expect(analytics.logScreenView).toHaveBeenCalledWith('FirstTutorial2')
    expect(analytics.logScreenView).toBeCalledTimes(2)
  })

  it('should have a button available on active index', () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)
    expect(() =>
      render(
        <GenericAchievementCard
          buttonText={buttonText}
          animation={animation}
          buttonCallback={buttonCallback}
          pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
          subTitle={subTitle}
          text={text}
          title={title}
        />
      )
    ).toThrowError()
  })

  it('should not have a button when not active index', () => {
    const { getByTestId, queryByText } = render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={2}
        lastIndex={2}
        activeIndex={1}
      />
    )
    expect(queryByText(buttonText)).toBeFalsy()
    expect(getByTestId('invisible-button-height')).toBeTruthy()
  })

  it('should have a button and no invisible-button-height when active index', () => {
    const { queryByTestId, getByText } = render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={1}
        activeIndex={1}
        lastIndex={1}
      />
    )
    expect(getByText(buttonText)).toBeTruthy()
    expect(queryByTestId('invisible-button-height')).toBeFalsy()
  })

  // FIXME: web integration
  it.skip('should pause animation when not on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={0}
        activeIndex={1}
        lastIndex={1}
      />
    )
    await waitForExpect(() => {
      expect(play).not.toBeCalled()
      expect(pause).toBeCalledTimes(1)
    })
  })

  // FIXME: web integration
  it.skip('should play animation when on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={0}
        activeIndex={0}
        lastIndex={1}
      />
    )
    await waitForExpect(() => {
      expect(play).toBeCalledTimes(1)
      expect(play).toBeCalledWith(0, pauseAnimationOnRenderAtFrame)
      expect(pause).not.toBeCalled()
    })
  })

  // FIXME: web integration
  it.skip('should not fade in button when not on active index', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        activeIndex={0}
        index={1}
        lastIndex={1}
      />
    )
    await waitForExpect(() => {
      expect(didFadeIn).not.toBe(true)
    })
  })

  // FIXME: web integration
  it.skip('should fade in button when on active index', async () => {
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
    render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        activeIndex={1}
        index={1}
        lastIndex={1}
      />
    )
    await waitForExpect(() => {
      expect(didFadeIn).toBe(true)
    })
  })

  // FIXME: web integration
  it.skip('should have a button to skip single card', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        play,
        pause,
      },
    })
    const skip = jest.fn()
    const { getByText } = render(
      <GenericAchievementCard
        buttonText={buttonText}
        animation={animation}
        buttonCallback={buttonCallback}
        pauseAnimationOnRenderAtFrame={pauseAnimationOnRenderAtFrame}
        subTitle={subTitle}
        text={text}
        title={title}
        index={0}
        activeIndex={0}
        lastIndex={0}
        skip={skip}
      />
    )
    const button = getByText('Passer')
    fireEvent.click(button)
    expect(skip).toHaveBeenCalled()
  })
})

function renderGenericAchievementCardComponent(props: AchievementCardProps) {
  return render(
    <GenericAchievement screenName="FirstTutorial">
      <GenericAchievementCard {...props} />
    </GenericAchievement>
  )
}
