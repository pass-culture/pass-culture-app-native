import React from 'react'

import { SubscriptionMessage } from 'api/gen'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { render, screen } from 'tests/utils'

jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => true),
}))

// callToActionTitle = false

describe('SubscriptionMessageBadge', () => {
  it('should display the subscription message', () => {
    renderSubscriptionMessageBadge({
      userMessage: 'hey',
      callToAction: { callToActionTitle: null },
    })

    expect(screen.queryByText('hey')).toBeOnTheScreen()
  })
})

const renderSubscriptionMessageBadge = (subscriptionMessage: SubscriptionMessage) =>
  render(<SubscriptionMessageBadge subscriptionMessage={subscriptionMessage} />)
