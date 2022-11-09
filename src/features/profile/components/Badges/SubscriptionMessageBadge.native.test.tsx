import React from 'react'

import { SubscriptionMessage } from 'api/gen'
import { render } from 'tests/utils'

import { SubscriptionMessageBadge } from './SubscriptionMessageBadge'

const mockedSubscriptionMessage = {
  callToActionMessage: {
    callToActionIcon: 'RETRY',
    callToActionLink: 'https://google.com',
    callToActionTitle: 'Tu peux cliquer',
  },
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

describe('SubscriptionMessageBadge', () => {
  afterAll(() => jest.resetAllMocks())

  it('should display component correctly', () => {
    const component = render(
      <SubscriptionMessageBadge subscriptionMessage={mockedSubscriptionMessage} />
    )
    expect(component).toMatchSnapshot()
  })
  it('should not display last update sentence if updatedAt props is null', () => {
    const component = render(
      <SubscriptionMessageBadge
        subscriptionMessage={{ ...mockedSubscriptionMessage, updatedAt: undefined }}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
