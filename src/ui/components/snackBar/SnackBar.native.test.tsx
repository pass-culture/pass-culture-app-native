import React from 'react'
import { Animated } from 'react-native'

import { render, waitFor, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'
import { Check } from 'ui/svg/icons/Check'

import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarHelperSettings } from './types'

const getAnimatedTimingImplementation = () =>
  jest
    .spyOn(Animated, 'timing')
    .mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() })

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('SnackBar Component', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  describe('Basic behavior', () => {
    it('should forward properly text and colors', () => {
      render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: Check,
          backgroundColor: theme.designSystem.color.background.success,
          progressBarColor: theme.designSystem.color.background.success,
          color: 'inverted',
          timeout: 1000,
          refresher: 1,
        })
      )

      screen.getByTestId('snackbar-message')

      const view = screen.getByTestId('snackbar-view')
      const progressBar = screen.getByTestId('snackbar-progressbar')
      const message = screen.getByTestId('snackbar-message')

      expect(view.props.backgroundColor).toEqual(theme.designSystem.color.background.success)
      expect(progressBar.props.backgroundColor).toEqual(theme.designSystem.color.background.success)
      expect(message.props.color).toEqual('inverted')
    })

    it('should not display progress bar if timeout is not provided', () => {
      render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: Check,
          backgroundColor: theme.designSystem.color.background.success,
          progressBarColor: theme.designSystem.color.text.success,
          color: 'inverted',
          refresher: 1,
        })
      )

      const progressBar = screen.queryByTestId('snackbar-progressbar')

      expect(progressBar).not.toBeOnTheScreen()
    })

    it('should render the content container when visible=true', () => {
      render(renderHelperSnackBar(true, { message: 'message' }))

      expect(screen.getByTestId('snackbar-message')).toBeOnTheScreen()
    })

    it('should render the content container when visible=false only if already rendered', async () => {
      const { rerender } = render(renderHelperSnackBar(false, { message: 'message' }, 0))

      expect(screen.queryByTestId('snackbar-container')).not.toBeOnTheScreen()

      rerender(renderHelperSnackBar(true, { message: 'message' }, 1))

      expect(screen.getByTestId('snackbar-container')).toBeOnTheScreen()

      rerender(renderHelperSnackBar(false, { message: 'message' }, 2))

      expect(screen.getByTestId('snackbar-container')).toBeOnTheScreen()
    })

    it('should render the illustration icon when provided when visible', () => {
      render(renderHelperSnackBar(true, { message: 'message' }))

      expect(screen.getByTestId('snackbar-icon')).toBeOnTheScreen()
    })

    it('should not render the illustration icon when not provided', () => {
      render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: undefined,
          backgroundColor: theme.designSystem.color.background.success,
          progressBarColor: theme.designSystem.color.text.success,
          color: 'inverted',
          refresher: 1,
        })
      )

      const icon = screen.queryByTestId('snackbar-icon')

      expect(icon).not.toBeOnTheScreen()
    })

    it('should trigger onClose when the closeIcon is clicked', async () => {
      const onClose = jest.fn()
      const snackBarMessage = 'message'

      render(renderHelperSnackBar(true, { message: snackBarMessage, onClose }))

      const touchable = screen.getByTestId(`Supprimer le message\u00a0: ${snackBarMessage}`)

      user.press(touchable)

      await waitFor(async () => expect(onClose).toHaveBeenCalledTimes(1))
    })
  })

  describe('Visibility lifecycle', () => {
    /**
     * refresher=0
     */
    describe('Initialisation', () => {
      it.each([true, false])(
        'should not display anything at initialisation when mounted (visible = %s)',
        async (visible) => {
          const timing = jest.spyOn(Animated, 'timing')

          const refresher = 0
          render(renderHelperSnackBar(visible, { message: 'message' }, refresher))

          await waitFor(async () => expect(timing).not.toHaveBeenCalled())
        }
      )
    })

    /**
     * "refresher" updated
     * "visible" goes from false to true
     */
    it('should display the snackbar container when shown', async () => {
      const timing = getAnimatedTimingImplementation()

      let refresher = 1
      const { rerender } = render(renderHelperSnackBar(false, { message: 'message' }, refresher))

      // this second rendering simulate the appearance
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(true, { message: 'message' }, refresher))

      const container = screen.getByTestId('snackbar-container')

      expect(container.props.style[0].display).toEqual('flex')

      /**
       * It's called twice because of the following function being triggered
       * in triggerApparitionAnimation:
       * - progressBarContainerRef?.current?.fadeInDown
       * - containerRef?.current?.fadeInDown
       */
      await waitFor(async () => expect(timing).toHaveBeenCalledTimes(2))

      timing.mockRestore()
    })

    /**
     * "refresher" updated
     * "visible" goes from true to false
     */
    it('should hide the snackbar container when hidden', async () => {
      const timing = jest.spyOn(Animated, 'timing')

      let refresher = 1
      const { rerender } = render(renderHelperSnackBar(true, { message: 'message' }, refresher))

      // this second rendering simulate the disappearance
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(false, { message: 'message' }, refresher))

      const container = screen.getByTestId('snackbar-container')

      /**
       * It's called twice because of the following function being triggered
       * in triggerApparitionAnimation:
       * - progressBarContainerRef.current?.fadeOutUp
       * - containerRef.current?.fadeOutUp
       */
      expect(timing).toHaveBeenCalledTimes(2)

      await waitFor(() => {
        expect(container.props.style[0].display).toEqual('none')
      })
    })

    /**
     * "refresher" updated
     * "visible" still the same => props.visible === state.isVisible
     */
    it('should reset progressBar animation when visual properties changed', async () => {
      const timing = getAnimatedTimingImplementation()

      let refresher = 1
      const { rerender } = render(renderHelperSnackBar(true, { message: 'message' }, refresher))

      // this second rendering simulate a change of props
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(true, { message: 'a new message', timeout: 2 }, refresher))

      const container = screen.getByTestId('snackbar-container')
      const text = screen.getByTestId('snackbar-message')

      /**
       * It's called once because of the following function being triggered
       * in animateProgressBarWidth:
       * - Animated.timing
       */
      expect(timing).toHaveBeenCalledTimes(1)
      expect(container.props.isVisible).toEqual(true)
      expect(text.props.children).toEqual('a new message')
    })

    it('should reset the timer when "refresher" is updated', async () => {
      const onClose = jest.fn()
      const timeout = 1
      const refresher = 1
      render(renderHelperSnackBar(false, { message: 'message', timeout, onClose }, refresher))
      await waitFor(async () => expect(onClose).toHaveBeenCalledTimes(1))
    })
  })
})

function renderSnackBar(props: SnackBarProps) {
  return (
    <SnackBar
      visible={props.visible}
      message={props.message}
      icon={props.icon}
      onClose={props.onClose}
      timeout={props.timeout}
      backgroundColor={props.backgroundColor}
      progressBarColor={props.progressBarColor}
      color={props.color}
      refresher={props.refresher}
      animationDuration={props.animationDuration}
    />
  )
}

function renderHelperSnackBar(visible: boolean, props: SnackBarHelperSettings, refresher = 1) {
  return (
    <SnackBar
      visible={visible}
      message={props.message}
      icon={Check}
      onClose={props.onClose}
      timeout={props.timeout}
      backgroundColor={theme.designSystem.color.background.brandPrimary}
      progressBarColor={theme.designSystem.color.background.brandSecondary}
      color="inverted"
      refresher={refresher}
      animationDuration={props.animationDuration}
    />
  )
}
