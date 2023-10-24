import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { PushNotificationsModal } from './PushNotificationsModal'

const onDismiss = jest.fn()
const onRequestPermission = jest.fn()

describe('PushNotificationsModal', () => {
  it('should render properly', () => {
    render(
      <PushNotificationsModal
        onDismiss={onDismiss}
        visible
        onRequestPermission={onRequestPermission}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should open settings and log event logOpenNotificationSettings', () => {
    render(
      <PushNotificationsModal
        onDismiss={onDismiss}
        visible
        onRequestPermission={onRequestPermission}
      />
    )
    fireEvent.press(screen.getByText('Autoriser les notifications'))

    expect(analytics.logOpenNotificationSettings).toHaveBeenCalledTimes(1)
    expect(onRequestPermission).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
