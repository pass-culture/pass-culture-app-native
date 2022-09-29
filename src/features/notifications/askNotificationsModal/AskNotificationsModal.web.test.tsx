import React from 'react'

import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { render } from 'tests/utils'

describe('AskNotificationsModal', () => {
  it('Render null in web', () => {
    const component = renderAskNotificationsModal()
    expect(component).toMatchObject({})
  })
})

function renderAskNotificationsModal() {
  const props = {
    visible: true,
    onHideModal: () => {},
  }
  return render(<AskNotificiationsModal {...props} />)
}
