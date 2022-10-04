import React from 'react'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { analytics } from 'libs/firebase/analytics'
import { render } from 'tests/utils'
import { fireEvent } from 'ui/components/modals/testUtils'

describe('AskNotificationsModal', () => {
  it('should not display the modal when is not visible', () => {
    const { queryByText } = render(
      <AskNotificiationsModal visible={false} onHideModal={jest.fn()} />
    )

    const title = queryByText('Activer les notifications')
    expect(title).toBeFalsy()
  })

  it('should display the modal when is visible', () => {
    const { queryByText } = render(
      <AskNotificiationsModal visible={true} onHideModal={jest.fn()} />
    )

    const button = queryByText('Activer les notifications')
    expect(button).toBeTruthy()
  })

  it('should log accepted notifications when press accept button', () => {
    const { getByText } = render(<AskNotificiationsModal visible={true} onHideModal={jest.fn()} />)

    const button = getByText('Activer les notifications')
    fireEvent.press(button)

    expect(analytics.logAcceptNotifications).toHaveBeenCalled()
  })

  it('should log dismissed notifications when press cross button and hide modale', () => {
    const { getByLabelText, queryByText } = render(
      <AskNotificiationsModal visible={true} onHideModal={jest.fn()} />
    )

    const crossButton = getByLabelText('Fermer la modale')
    fireEvent.press(crossButton)

    expect(analytics.logDismissNotifications).toHaveBeenCalled()

    const button = queryByText('Activer les notifications')
    expect(button?.props.visible).toBeFalsy()
  })
})
