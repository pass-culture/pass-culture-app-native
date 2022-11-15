import React from 'react'
import { Linking } from 'react-native'
import * as Permissions from 'react-native-permissions'
import waitForExpect from 'wait-for-expect'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { analytics } from 'libs/firebase/analytics'
import { BatchPush } from 'libs/react-native-batch'
import { fireEvent, render } from 'tests/utils'

const mockOpenSettings = jest.spyOn(Linking, 'openSettings')
const mockCheckNotifications = jest.spyOn(Permissions, 'checkNotifications')
const RESULTS = Permissions.RESULTS

const hideModal = jest.fn()
describe('AskNotificationsModal', () => {
  it('should not display the modal when is not visible', () => {
    const { queryByText } = render(
      <AskNotificiationsModal visible={false} onHideModal={hideModal} />
    )

    const title = queryByText('Activer les notifications')
    expect(title).toBeFalsy()
  })

  it('should display the modal when is visible', () => {
    const { queryByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = queryByText('Activer les notifications')
    expect(button).toBeTruthy()
  })

  it('should log accepted notifications when press accept button', () => {
    const { getByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = getByText('Activer les notifications')
    fireEvent.press(button)

    expect(analytics.logAcceptNotifications).toHaveBeenCalledTimes(1)
  })

  it('should request notification autorization accepted notifications when press accept button', () => {
    const { getByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = getByText('Activer les notifications')
    fireEvent.press(button)

    expect(analytics.logAcceptNotifications).toHaveBeenCalledTimes(1)
  })

  it('should hide modal when accept button is pressed and permissions are already granted', async () => {
    mockCheckNotifications.mockResolvedValueOnce({ status: RESULTS.GRANTED, settings: {} })
    const { getByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = getByText('Activer les notifications')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should hide modal when accept button is pressed and request notification is pressed and permissions are denied (first time asking)', async () => {
    mockCheckNotifications.mockResolvedValueOnce({ status: RESULTS.DENIED, settings: {} })
    const { getByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const button = getByText('Activer les notifications')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalledTimes(1)
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  it.each<Permissions.PermissionStatus>([RESULTS.UNAVAILABLE, RESULTS.BLOCKED, RESULTS.LIMITED])(
    'should open settings when accept button is pressed and permission is not granted nor denied',
    async (status) => {
      mockCheckNotifications.mockResolvedValueOnce({ status, settings: {} })
      const { getByText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

      const button = getByText('Activer les notifications')
      fireEvent.press(button)

      await waitForExpect(() => {
        expect(mockOpenSettings).toHaveBeenCalledTimes(1)
        expect(hideModal).toHaveBeenCalledTimes(1)
      })
    }
  )

  it('should log dismissed notifications when press cross button and hide modale', async () => {
    const { getByLabelText } = render(<AskNotificiationsModal visible onHideModal={hideModal} />)

    const crossButton = getByLabelText('Fermer la modale')
    fireEvent.press(crossButton)

    await waitForExpect(() => {
      expect(analytics.logDismissNotifications).toHaveBeenCalledTimes(1)
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })
})
