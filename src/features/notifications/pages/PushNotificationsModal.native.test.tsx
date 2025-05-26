import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { PushNotificationsModal } from './PushNotificationsModal'

const onDismiss = jest.fn()
const onRequestPermission = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

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

  it('should open settings and log event logOpenNotificationSettings', async () => {
    render(
      <PushNotificationsModal
        onDismiss={onDismiss}
        visible
        onRequestPermission={onRequestPermission}
      />
    )
    await user.press(screen.getByText('Autoriser les notifications'))

    expect(analytics.logOpenNotificationSettings).toHaveBeenCalledTimes(1)
    expect(onRequestPermission).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
