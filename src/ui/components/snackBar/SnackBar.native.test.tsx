import React from 'react'
import * as RN from 'react-native'

import { fireEvent, render, waitFor } from 'tests/utils'
import { Check } from 'ui/svg/icons/Check'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarHelperSettings } from './types'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

const getAnimatedTimingImplementation = () =>
  jest
    .spyOn(RN.Animated, 'timing')
    .mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() })

describe('SnackBar Component', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })
  describe('Basic behavior', () => {
    it('should forward properly text and colors', () => {
      const { getByTestId } = render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: Check,
          backgroundColor: ColorsEnum.ACCENT,
          progressBarColor: ColorsEnum.GREEN_LIGHT,
          color: ColorsEnum.WHITE,
          timeout: 1000,
          refresher: 1,
        })
      )

      getByTestId('snackbar-message')

      const view = getByTestId('snackbar-view')
      const progressBar = getByTestId('snackbar-progressbar')
      const message = getByTestId('snackbar-message')

      expect(view.props.backgroundColor).toEqual(ColorsEnum.ACCENT)
      expect(progressBar.props.backgroundColor).toEqual(ColorsEnum.GREEN_LIGHT)
      expect(message.props.color).toEqual(ColorsEnum.WHITE)
    })
    it('should not display proress bar if timeout is not provided', () => {
      const { queryByTestId } = render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: Check,
          backgroundColor: ColorsEnum.ACCENT,
          progressBarColor: ColorsEnum.GREEN_LIGHT,
          color: ColorsEnum.WHITE,
          refresher: 1,
        })
      )
      const progressBar = queryByTestId('snackbar-progressbar')
      expect(progressBar).toBeNull()
    })
    it('should render the content container when visible=true', () => {
      const { getByTestId } = render(renderHelperSnackBar(true, { message: 'message' }))

      getByTestId('snackbar-message')
    })
    it('should not render the empty container when visible=false', () => {
      const { getByTestId } = render(renderHelperSnackBar(false, { message: 'message' }))

      const container = getByTestId('snackbar-container')

      expect(container.props.style[0].display).toEqual('none')
    })
    it('should render the illustration icon when provided', () => {
      const { getByTestId } = render(renderHelperSnackBar(false, { message: 'message' }))

      getByTestId('snackbar-icon')
    })
    it('should not render the illustration icon when not provided', () => {
      const { queryByTestId } = render(
        renderSnackBar({
          visible: true,
          message: 'message',
          icon: undefined,
          backgroundColor: ColorsEnum.ACCENT,
          progressBarColor: ColorsEnum.GREEN_LIGHT,
          color: ColorsEnum.WHITE,
          refresher: 1,
        })
      )
      const icon = queryByTestId('snackbar-icon')

      expect(icon).toBeFalsy()
    })
    it('should trigger onClose when the closeIcon is clicked', async () => {
      const onClose = jest.fn()
      const { getByTestId } = render(renderHelperSnackBar(true, { message: 'message', onClose }))

      const touchable = getByTestId('snackbar-close')

      fireEvent.press(touchable)

      await waitFor(async () => expect(onClose).toBeCalled())
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
          const timing = jest.spyOn(RN.Animated, 'timing')

          const refresher = 0
          render(renderHelperSnackBar(visible, { message: 'message' }, refresher))

          await waitFor(async () => expect(timing).not.toBeCalled())
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
      const { rerender, getByTestId } = render(
        renderHelperSnackBar(false, { message: 'message' }, refresher)
      )

      // this second rendering simulate the appearance
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(true, { message: 'message' }, refresher))

      const container = getByTestId('snackbar-container')

      expect(container.props.style[0].display).toEqual('flex')

      /**
       * It's called twice because of the following function being triggered
       * in triggerApparitionAnimation:
       * - progressBarContainerRef?.current?.fadeInDown
       * - containerRef?.current?.fadeInDown
       */
      await waitFor(async () => expect(timing).toBeCalledTimes(2))

      timing.mockRestore()
    })
    /**
     * "refresher" updated
     * "visible" goes from true to false
     */
    it('should hide the snackbar container when hidden', async () => {
      const timing = jest.spyOn(RN.Animated, 'timing')

      let refresher = 1
      const { rerender, getByTestId } = render(
        renderHelperSnackBar(true, { message: 'message' }, refresher)
      )

      // this second rendering simulate the disappearance
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(false, { message: 'message' }, refresher))

      const container = getByTestId('snackbar-container')
      await waitFor(() => {
        expect(container.props.style[0].display).toEqual('none')
      })
      /**
       * It's called twice because of the following function being triggered
       * in triggerApparitionAnimation:
       * - progressBarContainerRef?.current?.fadeOutUp
       * - containerRef?.current?.fadeOutUpé@
       */
      await waitFor(async () => expect(timing).toBeCalledTimes(2))
    })
    /**
     * "refresher" updated
     * "visible" still the same => props.visible === state.isVisible
     */
    it('should reset progressBar animation when visual properties changed', async () => {
      const timing = getAnimatedTimingImplementation()

      let refresher = 1
      const { rerender, getByTestId } = render(
        renderHelperSnackBar(true, { message: 'message' }, refresher)
      )

      // this second rendering simulate a change of props
      refresher = 2 // should de greather than the previous
      rerender(renderHelperSnackBar(true, { message: 'a new message', timeout: 2 }, refresher))

      await waitFor(() => {
        const container = getByTestId('snackbar-container')
        const text = getByTestId('snackbar-message')

        expect(container.props.isVisible).toEqual(true)
        expect(text.props.children).toEqual('a new message')
      })
      /**
       * It's called once because of the following function being triggered
       * in animateProgressBarWidth:
       * - Animated.timing
       */
      await waitFor(async () => expect(timing).toBeCalledTimes(1))
    })
    it('should reset the timer when "refresher" is updated', async () => {
      const onClose = jest.fn()
      const timeout = 1
      const refresher = 1
      render(renderHelperSnackBar(false, { message: 'message', timeout, onClose }, refresher))
      await waitFor(async () => expect(onClose).toBeCalledTimes(1))
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
      backgroundColor={ColorsEnum.PRIMARY}
      progressBarColor={ColorsEnum.SECONDARY}
      color={ColorsEnum.WHITE}
      refresher={refresher}
      animationDuration={props.animationDuration}
    />
  )
}
