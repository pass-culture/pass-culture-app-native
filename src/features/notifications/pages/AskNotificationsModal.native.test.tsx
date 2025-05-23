import React from 'react'
import { Linking } from 'react-native'
import * as Permissions from 'react-native-permissions'

import { analytics } from 'libs/analytics/provider'
import { BatchPush } from 'libs/react-native-batch'
import { render, screen, userEvent } from 'tests/utils'

import { AskNotificiationsModal } from './AskNotificationsModal'

const mockOpenSettings = jest.spyOn(Linking, 'openSettings')
const mockCheckNotifications = jest.spyOn(Permissions, 'checkNotifications')
const RESULTS = Permissions.RESULTS

const hideModal = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('AskNotificationsModal', () => {
  it('should render properly', () => {
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    expect(screen).toMatchSnapshot()
  })

  it('should log accepted notifications when press accept button', async () => {
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = screen.getByText('Activer les notifications')
    await user.press(button)

    expect(analytics.logAcceptNotifications).toHaveBeenCalledTimes(1)
  })

  it('should request notification autorization accepted notifications when press accept button', async () => {
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = screen.getByText('Activer les notifications')
    await user.press(button)

    expect(analytics.logAcceptNotifications).toHaveBeenCalledTimes(1)
  })

  it('should hide modal when accept button is pressed and permissions are already granted', async () => {
    mockCheckNotifications.mockResolvedValueOnce({ status: RESULTS.GRANTED, settings: {} })
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = screen.getByText('Activer les notifications')
    await user.press(button)

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should hide modal when accept button is pressed and request notification is pressed and permissions are denied (first time asking)', async () => {
    mockCheckNotifications.mockResolvedValueOnce({ status: RESULTS.DENIED, settings: {} })
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = screen.getByText('Activer les notifications')
    await user.press(button)

    expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalledTimes(1)
    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it.each<Permissions.PermissionStatus>([RESULTS.UNAVAILABLE, RESULTS.BLOCKED, RESULTS.LIMITED])(
    'should open settings when accept button is pressed and permission is not granted nor denied',
    async (status) => {
      mockCheckNotifications.mockResolvedValueOnce({ status, settings: {} })
      render(<AskNotificiationsModal visible onHideModal={hideModal} />)

      const button = screen.getByText('Activer les notifications')
      await user.press(button)

      expect(mockOpenSettings).toHaveBeenCalledTimes(1)
      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it('should log dismissed notifications when press cross button and hide modale', async () => {
    render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const crossButton = screen.getByLabelText('Fermer la modale')
    await user.press(crossButton)

    expect(analytics.logDismissNotifications).toHaveBeenCalledTimes(1)
    expect(hideModal).toHaveBeenCalledTimes(1)
  })
})
