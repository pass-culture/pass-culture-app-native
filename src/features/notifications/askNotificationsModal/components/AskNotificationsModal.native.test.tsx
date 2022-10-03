import React from 'react'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { render } from 'tests/utils'

describe('AskNotificationsModal', () => {
  it('should not display the modal when visible is false', () => {
    const { queryByText } = render(
      <AskNotificiationsModal visible={false} onHideModal={jest.fn()} />
    )

    const title = queryByText('Activer les notifications')
    expect(title).toBeFalsy()
  })

  it('should display the modal when visible is true', () => {
    const { queryByText } = render(
      <AskNotificiationsModal visible={true} onHideModal={jest.fn()} />
    )

    const button = queryByText('Activer les notifications')
    expect(button).toBeTruthy()
  })
})
