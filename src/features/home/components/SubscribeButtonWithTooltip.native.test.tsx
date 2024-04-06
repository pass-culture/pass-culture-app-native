import React from 'react'

import { SubscribeButtonWithTooltip } from 'features/home/components/SubscribeButtonWithTooltip'
import { act, render, screen } from 'tests/utils'

const DISPLAY_START_OFFSET_IN_MS = 1000
const TOOLTIP_TEXT = 'Suis ce thème pour recevoir de l’actualité sur ce sujet !'

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<SubscribeButtonWithTooltip />', () => {
  it('should not show tooltip before 1 second has elapsed', () => {
    render(<SubscribeButtonWithTooltip active={false} onPress={jest.fn()} />)

    jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS - 1)

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should show tooltip after 1 second when user is not subscribed', async () => {
    render(<SubscribeButtonWithTooltip active={false} onPress={jest.fn()} />)

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.getByText(TOOLTIP_TEXT)).toBeOnTheScreen()
  })

  it('should not show tooltip when user is already subscribed', () => {
    render(<SubscribeButtonWithTooltip active onPress={jest.fn()} />)

    act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })

  it('should hide tooltip 8 seconds after display', async () => {
    render(<SubscribeButtonWithTooltip active={false} onPress={jest.fn()} />)

    await act(() => jest.advanceTimersByTime(DISPLAY_START_OFFSET_IN_MS))
    await act(() => jest.advanceTimersByTime(8000))

    expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeOnTheScreen()
  })
})
