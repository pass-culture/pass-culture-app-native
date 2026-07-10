import React from 'react'

import {
  analyticsDebuggerActions,
  analyticsDebuggerSelectors,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { render, screen, userEvent } from 'tests/utils'

import { CheatcodesScreenAnalyticsDebugger } from './CheatcodesScreenAnalyticsDebugger'

const user = userEvent.setup()

describe('<CheatcodesScreenAnalyticsDebugger />', () => {
  afterEach(() => {
    analyticsDebuggerActions.clearEvents()
    analyticsDebuggerActions.setCaptureEnabled(false)
    analyticsDebuggerActions.setBubbleVisible(false)
    analyticsDebuggerActions.hideOverlay()
  })

  it('should display the number of captured events', () => {
    analyticsDebuggerActions.setCaptureEnabled(true)
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<CheatcodesScreenAnalyticsDebugger />)

    expect(screen.getByText('1 événement(s) capturé(s)')).toBeOnTheScreen()
  })

  it('should enable event capture with the switch', async () => {
    render(<CheatcodesScreenAnalyticsDebugger />)

    await user.press(
      screen.getByTestId(/Activer la capture des événements analytics - Interrupteur à bascule/)
    )

    expect(analyticsDebuggerSelectors.selectCaptureEnabled()).toBe(true)
  })

  it('should show the floating bubble with the switch', async () => {
    render(<CheatcodesScreenAnalyticsDebugger />)

    await user.press(
      screen.getByTestId(/Afficher la bulle flottante du debugger - Interrupteur à bascule/)
    )

    expect(analyticsDebuggerSelectors.selectBubbleVisible()).toBe(true)
  })

  it('should open the overlay when pressing "Ouvrir l’overlay"', async () => {
    render(<CheatcodesScreenAnalyticsDebugger />)

    await user.press(screen.getByText('Ouvrir l’overlay'))

    expect(analyticsDebuggerSelectors.selectOverlayVisible()).toBe(true)
  })

  it('should clear the events when pressing "Vider les événements"', async () => {
    analyticsDebuggerActions.setCaptureEnabled(true)
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<CheatcodesScreenAnalyticsDebugger />)

    await user.press(screen.getByText('Vider les événements'))

    expect(analyticsDebuggerSelectors.selectEvents()).toEqual([])
  })
})
