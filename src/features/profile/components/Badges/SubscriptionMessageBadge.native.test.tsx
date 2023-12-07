import React from 'react'

import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { render, screen } from 'tests/utils'

jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => true),
}))

describe('SubscriptionMessageBadge', () => {
  it('should display the subscription message', () => {
    render(<SubscriptionMessageBadge subscriptionMessage={{ userMessage: 'hey' }} />)

    expect(screen.queryByText('hey')).toBeOnTheScreen()
  })
})
