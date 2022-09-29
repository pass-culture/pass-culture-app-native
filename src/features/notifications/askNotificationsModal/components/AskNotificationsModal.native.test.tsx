import React from 'react'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { render } from 'tests/utils'

describe('AskNotificationsModal', () => {
  it('should not display the modal when visible is false', () => {
    const { queryByText } = renderAskNotificationsModal(false)

    const title = queryByText('Activer les notifications')
    expect(title).toBeFalsy()
  })

  it('should display the modal when visible is true', () => {
    const { queryByText } = renderAskNotificationsModal(true)

    const button = queryByText('Activer les notifications')
    expect(button).toBeTruthy()
  })
})

function renderAskNotificationsModal(visible: boolean) {
  const props = {
    visible: visible,
    onHideModal: () => {},
  }
  return render(<AskNotificiationsModal {...props} />)
}
