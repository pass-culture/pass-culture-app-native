import React from 'react'

import { SubscriptionMessage } from 'api/gen'
import { render } from 'tests/utils'

import { IdCheckProcessingBadge } from './IdCheckProcessingBadge'

const mockedSubscriptionMessage = {
  callToActionMessage: {
    callToActionIcon: 'RETRY',
    callToActionLink: 'https://google.com',
    callToActionTitle: 'Tu peux cliquer',
  },
  popOverIcon: 'FILE',
  updatedAt: new Date('2021-10-25T13:24Z'),
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

describe('IdCheckProcessingBadge', () => {
  afterAll(() => jest.resetAllMocks())

  it('should display component correctly', () => {
    const component = render(
      <IdCheckProcessingBadge subscriptionMessage={mockedSubscriptionMessage} />
    )
    expect(component).toMatchSnapshot()
  })
  it('should not display last update sentence if updatedAt props is null', () => {
    const component = render(
      <IdCheckProcessingBadge
        // @ts-expect-error updatedAt should not be null, testing the case where it is
        subscriptionMessage={{ ...mockedSubscriptionMessage, updatedAt: undefined }}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
