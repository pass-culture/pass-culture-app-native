import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, screen } from 'tests/utils'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<UnsubscribingConfirmationModal />', () => {
  it('should render correctly', () => {
    render(
      <UnsubscribingConfirmationModal
        visible
        theme={SubscriptionTheme.MUSIQUE}
        dismissModal={jest.fn()}
        onUnsubscribePress={jest.fn()}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
