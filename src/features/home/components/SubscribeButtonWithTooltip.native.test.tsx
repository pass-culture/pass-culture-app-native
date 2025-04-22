import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { SubscribeButtonWithTooltip } from 'features/home/components/SubscribeButtonWithTooltip'
import { storage } from 'libs/storage'
import { act, render, screen, userEvent } from 'tests/utils'

const DISPLAY_START_OFFSET_IN_MS = 1000
const TOOLTIP_TEXT = 'Suis ce thème pour recevoir de l’actualité sur ce sujet !'

jest.unmock('@react-navigation/native')
jest.useFakeTimers()

const user = userEvent.setup()

describe('<SubscribeButtonWithTooltip />', () => {
  beforeEach(() => storage.clear('times_subscription_tooltip_has_been_displayed'))

  it('should not show tooltip before 1 second has elapsed', () => {
    renderSubscribeButtonWithTooltip()

    jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS - 1)

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should show tooltip after 1 second when user is not subscribed', async () => {
    renderSubscribeButtonWithTooltip()

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.getByText(TOOLTIP_TEXT)).toBeOnTheScreen()
  })

  it('should not show tooltip when user is already subscribed', () => {
    renderSubscribeButtonWithTooltip({ active: true })

    act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should hide tooltip 8 seconds after display', async () => {
    renderSubscribeButtonWithTooltip()

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))
    await act(() => jest.advanceTimersByTime(8000))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should not show tooltip more than 3 times', async () => {
    renderSubscribeButtonWithTooltip()
    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.getByText(TOOLTIP_TEXT)).toBeOnTheScreen()

    renderSubscribeButtonWithTooltip()
    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.getByText(TOOLTIP_TEXT)).toBeOnTheScreen()

    renderSubscribeButtonWithTooltip()
    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.getByText(TOOLTIP_TEXT)).toBeOnTheScreen()

    renderSubscribeButtonWithTooltip()
    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should hide tooltip when pressing close button', async () => {
    renderSubscribeButtonWithTooltip()

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    await user.press(screen.getByLabelText('Fermer le tooltip'))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should not show tooltip anymore when user presses close button', async () => {
    renderSubscribeButtonWithTooltip()

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))
    await user.press(screen.getByLabelText('Fermer le tooltip'))

    renderSubscribeButtonWithTooltip()
    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })
})

const renderSubscribeButtonWithTooltip = ({ active }: { active: boolean } = { active: false }) =>
  render(
    <NavigationContainer>
      <SubscribeButtonWithTooltip active={active} onPress={jest.fn()} />
    </NavigationContainer>
  )
