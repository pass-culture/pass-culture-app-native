import React from 'react'
import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { fireEvent, render, screen, act } from 'tests/utils'

jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => true),
}))

const mockShouldOpenInbox = jest.fn().mockReturnValue(true)
jest.mock('features/profile/helpers/shouldOpenInbox', () => ({
  shouldOpenInbox: jest.fn(() => mockShouldOpenInbox()),
}))

describe('<SubscriptionMessageBadge />', () => {
  it('should display the subscription message', () => {
    renderSubscriptionMessageBadge({
      userMessage: 'hey',
      callToAction: { callToActionTitle: 'hey2', callToActionLink: 'https://fake.net' },
    })

    expect(screen.queryByText('hey2')).toBeOnTheScreen()
  })

  it('should not display CTA when no message link specified', async () => {
    renderSubscriptionMessageBadge({
      userMessage: 'hey',
      callToAction: { callToActionTitle: 'hey2' },
    })

    expect(screen.queryByText('hey2')).not.toBeOnTheScreen()
  })

  it('should not display CTA if link is not valid', async () => {
    mockShouldOpenInbox.mockReturnValueOnce(false)
    renderSubscriptionMessageBadge({
      userMessage: 'hey',
      callToAction: { callToActionTitle: 'hey2', callToActionLink: 'https://fake.net' },
    })

    await act(() => {
      const button = screen.getByText('hey2')
      fireEvent.press(button)
    })

    expect(openInbox).not.toHaveBeenCalled()
  })

  it('should display CTA when link is valid', async () => {
    renderSubscriptionMessageBadge({
      userMessage: 'hey',
      callToAction: { callToActionTitle: 'hey2', callToActionLink: 'https://fake.net' },
    })

    await act(() => {
      const button = screen.getByText('hey2')
      fireEvent.press(button)
    })

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})

const renderSubscriptionMessageBadge = (subscriptionMessage: SubscriptionMessage) =>
  render(<SubscriptionMessageBadge subscriptionMessage={subscriptionMessage} />)
