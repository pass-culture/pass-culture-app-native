import React from 'react'
import { Text } from 'react-native'
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils'

import {
  analyticsDebuggerActions,
  analyticsDebuggerSelectors,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { env } from 'libs/environment/env'
import { act, render, screen } from 'tests/utils'

import { AnalyticsDebugger } from './AnalyticsDebugger'

describe('<AnalyticsDebugger />', () => {
  afterEach(() => {
    analyticsDebuggerActions.hideOverlay()
    analyticsDebuggerActions.setBubbleVisible(false)
    env.ANALYTICS_DEBUGGER_ENABLED = true
  })

  it('should render its children', () => {
    render(
      <AnalyticsDebugger>
        <Text>Children</Text>
      </AnalyticsDebugger>
    )

    expect(screen.getByText('Children')).toBeOnTheScreen()
  })

  it('should only render its children when the debugger is disabled on the environment', () => {
    env.ANALYTICS_DEBUGGER_ENABLED = false

    render(
      <AnalyticsDebugger>
        <Text>Children</Text>
      </AnalyticsDebugger>
    )

    expect(screen.getByText('Children')).toBeOnTheScreen()
    expect(screen.queryByText('Analytics debugger')).not.toBeOnTheScreen()
  })

  it('should toggle the bubble on a two-finger long press', () => {
    render(
      <AnalyticsDebugger>
        <Text>Children</Text>
      </AnalyticsDebugger>
    )

    expect(screen.queryByTestId('analyticsDebuggerBubble')).not.toBeOnTheScreen()

    act(() => {
      fireGestureHandler(getByGestureTestId('analyticsDebuggerGesture'))
    })

    expect(analyticsDebuggerSelectors.selectBubbleVisible()).toBe(true)
    expect(screen.getByTestId('analyticsDebuggerBubble')).toBeOnTheScreen()

    act(() => {
      fireGestureHandler(getByGestureTestId('analyticsDebuggerGesture'))
    })

    expect(analyticsDebuggerSelectors.selectBubbleVisible()).toBe(false)
  })

  it('should toggle the overlay when tapping the bubble', () => {
    analyticsDebuggerActions.setBubbleVisible(true)

    render(
      <AnalyticsDebugger>
        <Text>Children</Text>
      </AnalyticsDebugger>
    )

    act(() => {
      fireGestureHandler(getByGestureTestId('analyticsDebuggerBubbleTap'))
    })

    expect(analyticsDebuggerSelectors.selectOverlayVisible()).toBe(true)
  })

  it('should hide the bubble on a long press', () => {
    analyticsDebuggerActions.setBubbleVisible(true)

    render(
      <AnalyticsDebugger>
        <Text>Children</Text>
      </AnalyticsDebugger>
    )

    act(() => {
      fireGestureHandler(getByGestureTestId('analyticsDebuggerBubbleLongPress'))
    })

    expect(analyticsDebuggerSelectors.selectBubbleVisible()).toBe(false)
    expect(screen.queryByTestId('analyticsDebuggerBubble')).not.toBeOnTheScreen()
  })
})
