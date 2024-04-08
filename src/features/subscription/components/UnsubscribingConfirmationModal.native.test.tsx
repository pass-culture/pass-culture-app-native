import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, screen } from 'tests/utils'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

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
