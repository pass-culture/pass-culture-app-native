import React from 'react'

import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'

import { GenericAchievement } from '../GenericAchievement/GenericAchievement'

import { AchievementCardProps, didFadeIn, GenericAchievementCard } from './GenericAchievementCard'

const animation = GeolocationAnimation
const buttonCallback = jest.fn()
const buttonText = 'Submit'
const pauseAnimationOnRenderAtFrame = 62
const subTitle = 'Subtitle'
const text = 'Text'
const title = 'Title'
const play = jest.fn()
const pause = jest.fn()

describe('<GenericAchievementCard />', () => {
  beforeEach(jest.resetAllMocks)

  it('should render correctly', () => {
    renderGenericAchievementCardComponent({
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

    expect(screen.getByText(title, { exact: false })).toBeTruthy()
    expect(screen.getByText(subTitle, { exact: false })).toBeTruthy()
    expect(screen.getByText(text)).toBeTruthy()

    const button = screen.getByText(buttonText)
    fireEvent.press(button)

    expect(buttonCallback).toHaveBeenCalledTimes(1)
  })

  it('should fail to render if not children of GenericAchievement', () => {
    renderGenericAchievementCardComponent({
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

    expect(screen.getByText(title, { exact: false })).toBeTruthy()
    expect(screen.getByText(subTitle, { exact: false })).toBeTruthy()
    expect(screen.getByText(text)).toBeTruthy()

    const button = screen.getByText(buttonText)
    fireEvent.press(button)

    expect(buttonCallback).toHaveBeenCalledTimes(1)
  })

  it('should call card analytics on active index', () => {
    render(
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

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(1, 'FirstTutorial1')

    fireEvent.press(screen.getByTestId('Continuer vers l’étape suivante'))

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(2, 'FirstTutorial2')
  })

  it('should have a button available on active index', () => {
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
    render(
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

    expect(screen.queryByText(buttonText)).toBeNull()
    expect(screen.getByTestId('invisible-button-height')).toBeTruthy()
  })

  it('should have a button and no invisible-button-height when active index', () => {
    render(
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

    expect(screen.getByText(buttonText)).toBeTruthy()
    expect(screen.queryByTestId('invisible-button-height')).toBeNull()
  })

  it('should pause animation when not on active index', async () => {
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

    await waitFor(() => {
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

    await waitFor(() => {
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

    await waitFor(() => {
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

    await waitFor(() => {
      expect(didFadeIn).toBe(true)
    })
  })

  it('should have a button to skip single card', () => {
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
    fireEvent.press(button)

    expect(skip).toHaveBeenCalledTimes(1)
  })
})

function renderGenericAchievementCardComponent(props: AchievementCardProps) {
  return render(
    <GenericAchievement screenName="FirstTutorial">
      <GenericAchievementCard {...props} />
    </GenericAchievement>
  )
}
